export type PlanId = 'free' | 'plus' | 'pro'
export type BillingInterval = 'monthly' | 'annual'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due'

export interface UserSubscription {
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: PlanId
  billing_interval: BillingInterval | null
  status: SubscriptionStatus
  bonus_credits: number
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface UsageInfo {
  plan: PlanId
  used: number
  limit: number
  bonus_credits: number
  remaining: number
  allowed_tones: string[]
}

export interface CreditPack {
  id: string
  amount: number
  price: number // in cents
  label: string
  priceId: string
  perAnalysis: string
}
