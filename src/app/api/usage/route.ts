import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PLAN_LIMITS, getAllowedTones } from '@/lib/usage'
import type { PlanId, UsageInfo } from '@/types/subscription'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  // Get subscription info
  const { data: sub } = await supabase
    .from('user_subscriptions')
    .select('plan, bonus_credits, status')
    .eq('user_id', user.id)
    .single()

  const plan: PlanId = (sub?.plan as PlanId) || 'free'
  const bonusCredits = sub?.bonus_credits || 0
  const limit = PLAN_LIMITS[plan]

  // Count analyses this calendar month
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
  const remaining = Math.max(0, limit + bonusCredits - used)

  const usage: UsageInfo = {
    plan,
    used,
    limit,
    bonus_credits: bonusCredits,
    remaining,
    allowed_tones: getAllowedTones(plan),
  }

  return NextResponse.json(usage)
}
