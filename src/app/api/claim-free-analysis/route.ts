import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'auth_required' }, { status: 401 })
    }

    const body = await request.json()
    const { freeAnalysisId } = body as { freeAnalysisId?: string }

    if (!freeAnalysisId) {
      return NextResponse.json({ error: 'Missing freeAnalysisId.' }, { status: 400 })
    }

    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Update free_analyses to link to the new user
    await admin
      .from('free_analyses')
      .update({ converted_to_user_id: user.id })
      .eq('id', freeAnalysisId)

    // Record an analysis_events entry so usage count reflects the free trial
    await supabase.from('analysis_events').insert({ user_id: user.id })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Claim free analysis error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
