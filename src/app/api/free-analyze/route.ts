import { NextRequest, NextResponse } from 'next/server'
import { analyzeConversation } from '@/lib/claude'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const ENDPOINT = 'free-analyze'
const RATE_LIMIT_HOURLY = 2
const RATE_LIMIT_DAILY = 5
const MIN_TEXT_LENGTH = 10
const MAX_TEXT_LENGTH = 2000
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function hashSHA256(value: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

function extractIP(request: NextRequest): string {
  return (
    request.headers.get('x-nf-client-connection-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}

function validateImageMagicBytes(base64Data: string): boolean {
  // Extract the raw base64 after the data URL prefix
  const match = base64Data.match(/^data:image\/[^;]+;base64,(.+)/)
  if (!match) return false

  const raw = match[1]
  // Decode first 12 bytes to check signatures
  const bytes = Buffer.from(raw.substring(0, 16), 'base64')

  // Check PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return true
  }

  // Check JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return true
  }

  // Check HEIC: ftyp box (bytes 4-7 should be "ftyp")
  if (bytes.length >= 8) {
    const ftypStr = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7])
    if (ftypStr === 'ftyp') return true
  }

  return false
}

export async function POST(request: NextRequest) {
  const admin = getAdminClient()

  try {
    const body = await request.json()
    const { text, screenshot, fingerprint, honeypot } = body as {
      text?: string
      screenshot?: string
      fingerprint?: string
      honeypot?: string
    }

    // 1. Honeypot check
    if (honeypot) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    // 2. Input validation
    if (!text && !screenshot) {
      return NextResponse.json(
        { error: 'Please provide either text or a screenshot to analyze.' },
        { status: 400 }
      )
    }

    if (text) {
      if (text.length < MIN_TEXT_LENGTH || text.length > MAX_TEXT_LENGTH) {
        return NextResponse.json(
          { error: 'free_analysis_error_validation' },
          { status: 400 }
        )
      }
    }

    if (screenshot) {
      // Check size (base64 is ~33% larger than binary)
      if (screenshot.length > MAX_IMAGE_SIZE * 1.37) {
        return NextResponse.json(
          { error: 'free_analysis_error_image_too_large' },
          { status: 400 }
        )
      }

      // Validate magic bytes
      if (!validateImageMagicBytes(screenshot)) {
        return NextResponse.json(
          { error: 'Invalid image format. Please use PNG, JPEG, or HEIC.' },
          { status: 400 }
        )
      }
    }

    // 3. Fingerprint validation
    if (!fingerprint || fingerprint.length < 16) {
      return NextResponse.json(
        { error: 'Invalid request.' },
        { status: 400 }
      )
    }

    // 4. IP extraction and hashing
    const rawIP = extractIP(request)
    const ipHash = await hashSHA256(rawIP)

    // 5. Rate limiting (fail closed: if query fails, reject)
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { data: hourlyData, error: hourlyErr } = await admin
        .from('rate_limits')
        .select('count')
        .eq('ip_hash', ipHash)
        .eq('endpoint', ENDPOINT)
        .gte('window_start', oneHourAgo)

      if (hourlyErr) throw hourlyErr

      const hourlyCount = hourlyData?.reduce((sum, r) => sum + (r.count || 0), 0) || 0
      if (hourlyCount >= RATE_LIMIT_HOURLY) {
        return NextResponse.json(
          { error: 'free_analysis_error_rate_limit' },
          { status: 429 }
        )
      }

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { data: dailyData, error: dailyErr } = await admin
        .from('rate_limits')
        .select('count')
        .eq('ip_hash', ipHash)
        .eq('endpoint', ENDPOINT)
        .gte('window_start', oneDayAgo)

      if (dailyErr) throw dailyErr

      const dailyCount = dailyData?.reduce((sum, r) => sum + (r.count || 0), 0) || 0
      if (dailyCount >= RATE_LIMIT_DAILY) {
        return NextResponse.json(
          { error: 'free_analysis_error_rate_limit' },
          { status: 429 }
        )
      }
    } catch (rateLimitErr) {
      console.error('Rate limit check failed:', rateLimitErr)
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again.' },
        { status: 503 }
      )
    }

    // 6. Fingerprint and IP deduplication (fail closed)
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

      // Check by fingerprint
      const { data: fpData, error: fpErr } = await admin
        .from('free_analyses')
        .select('id')
        .eq('fingerprint_hash', fingerprint)
        .gte('created_at', twentyFourHoursAgo)
        .limit(1)

      if (fpErr) throw fpErr

      if (fpData && fpData.length > 0) {
        return NextResponse.json(
          { error: 'free_analysis_error_duplicate' },
          { status: 403 }
        )
      }

      // Check by IP
      const { data: ipData, error: ipErr } = await admin
        .from('free_analyses')
        .select('id')
        .eq('ip_hash', ipHash)
        .gte('created_at', twentyFourHoursAgo)
        .limit(1)

      if (ipErr) throw ipErr

      if (ipData && ipData.length > 0) {
        return NextResponse.json(
          { error: 'free_analysis_error_duplicate' },
          { status: 403 }
        )
      }

      // Also check cookie fingerprint if different from body fingerprint
      const cookieFp = request.cookies.get('reveald_fp')?.value
      if (cookieFp && cookieFp !== fingerprint) {
        const { data: cookieData, error: cookieErr } = await admin
          .from('free_analyses')
          .select('id')
          .eq('fingerprint_hash', cookieFp)
          .gte('created_at', twentyFourHoursAgo)
          .limit(1)

        if (cookieErr) throw cookieErr

        if (cookieData && cookieData.length > 0) {
          return NextResponse.json(
            { error: 'free_analysis_error_duplicate' },
            { status: 403 }
          )
        }
      }
    } catch (dedupErr) {
      console.error('Fingerprint dedup check failed:', dedupErr)
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again.' },
        { status: 503 }
      )
    }

    // 7. Call Claude API (identical quality to authenticated analysis)
    const analysis = await analyzeConversation({ text, screenshot })

    // 8. Record free analysis and rate limit entry
    const { data: freeAnalysisRecord, error: insertErr } = await admin
      .from('free_analyses')
      .insert({ ip_hash: ipHash, fingerprint_hash: fingerprint })
      .select('id')
      .single()

    if (insertErr) {
      console.error('Failed to record free analysis:', insertErr)
    }

    // Record rate limit entry
    await admin.from('rate_limits').insert({
      ip_hash: ipHash,
      endpoint: ENDPOINT,
    })

    // 9. Build response with fingerprint cookie
    const response = NextResponse.json({
      analysis,
      freeAnalysisId: freeAnalysisRecord?.id || null,
    })

    // Set httpOnly fingerprint cookie (24h expiry)
    response.cookies.set('reveald_fp', fingerprint, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    })

    return response
  } catch (error: unknown) {
    console.error('Free analysis error:', error instanceof Error ? error.stack : error)

    const rawMessage = error instanceof Error ? error.message : ''

    let userMessage: string
    let status: number

    if (rawMessage.includes('temporarily busy') || rawMessage.includes('529') || rawMessage.includes('Overloaded') || rawMessage.includes('Internal server error') || rawMessage.includes('500')) {
      userMessage = 'Our analysis service is busy right now. Please try again in a few seconds.'
      status = 503
    } else if (rawMessage.includes('Rate limited') || rawMessage.includes('429')) {
      userMessage = 'Too many requests. Please wait a moment and try again.'
      status = 429
    } else if (rawMessage.includes('credit balance') || rawMessage.includes('billing')) {
      userMessage = 'Service temporarily unavailable. Please try again later.'
      status = 503
    } else if (rawMessage.includes('ANTHROPIC_API_KEY')) {
      userMessage = 'Service not configured. Please contact support.'
      status = 500
    } else {
      userMessage = 'Something went wrong. Please try again.'
      status = 500
    }

    return NextResponse.json({ error: userMessage }, { status })
  }
}
