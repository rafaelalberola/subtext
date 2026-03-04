import { NextRequest, NextResponse } from 'next/server'
import { analyzeConversation } from '@/lib/claude'
import { createClient } from '@/lib/supabase/server'
import { PLAN_LIMITS } from '@/lib/usage'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import type { PlanId } from '@/types/subscription'

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'auth_required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { text, screenshot, personContext } = body as { text?: string; screenshot?: string; personContext?: string }

    if (!text && !screenshot) {
      return NextResponse.json(
        { error: 'Please provide either text or a screenshot to analyze.' },
        { status: 400 }
      )
    }

    // Validate text length
    if (text && text.length > 5000) {
      return NextResponse.json(
        { error: 'Text is too long. Please keep it under 5,000 characters.' },
        { status: 400 }
      )
    }

    // Validate screenshot size (max ~10MB base64)
    if (screenshot && screenshot.length > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Screenshot is too large. Please use a smaller image.' },
        { status: 400 }
      )
    }

    // Usage check
    const { data: sub } = await supabase
      .from('user_subscriptions')
      .select('plan, bonus_credits')
      .eq('user_id', user.id)
      .single()

    const plan: PlanId = (sub?.plan as PlanId) || 'free'
    const bonusCredits = sub?.bonus_credits || 0
    const limit = PLAN_LIMITS[plan]
    const isUnlimited = limit === -1

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()

    const { count } = await supabase
      .from('analysis_events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', monthStart)
      .lt('created_at', monthEnd)

    const used = count || 0

    // Pro is unlimited; other plans check monthly limit + bonus credits
    if (!isUnlimited) {
      const remaining = limit + bonusCredits - used

      if (remaining <= 0) {
        return NextResponse.json(
          { error: 'usage_limit_reached', plan, used, limit },
          { status: 402 }
        )
      }
    }

    const analysis = await analyzeConversation({ text, screenshot, personContext })

    // Record usage event
    await supabase.from('analysis_events').insert({ user_id: user.id })

    // Pack credits consumed AFTER monthly allowance is exhausted
    if (!isUnlimited && used >= limit && bonusCredits > 0) {
      const admin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      await admin.from('user_subscriptions')
        .update({ bonus_credits: bonusCredits - 1, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Analysis error:', error)

    const rawMessage =
      error instanceof Error ? error.message : ''

    // Map technical errors to user-friendly messages
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
