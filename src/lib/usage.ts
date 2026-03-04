import type { PlanId, CreditPack } from '@/types/subscription'

export const PLAN_LIMITS: Record<PlanId, number> = {
  free: 3,
  plus: 30,
  pro: -1, // unlimited
}

export const ALL_TONES = ['Direct', 'Warm', 'Playful', 'Professional', 'Cautious'] as const

export function getAllowedTones(plan: PlanId): string[] {
  if (plan === 'free') return ['Direct']
  if (plan === 'plus') return ['Direct', 'Warm', 'Professional']
  return [...ALL_TONES]
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'credits_10',
    amount: 10,
    price: 499,
    label: '10',
    priceId: process.env.NEXT_PUBLIC_STRIPE_CREDITS_10_PRICE_ID || '',
    perAnalysis: '$0.50',
  },
]

export const PLAN_FEATURES: Record<PlanId, string[]> = {
  free: [
    'feature_3_analyses',
    'feature_basic_analysis',
    'feature_one_tone',
  ],
  plus: [
    'feature_30_analyses',
    'feature_full_analysis',
    'feature_three_tones',
    'feature_history',
    'feature_contact_labels',
  ],
  pro: [
    'feature_unlimited_analyses',
    'feature_full_analysis',
    'feature_all_tones',
    'feature_history',
    'feature_contact_labels',
    'feature_priority',
    'feature_anonymization',
  ],
}

export const PLAN_PRICES = {
  free: { monthly: 0, annual: 0 },
  plus: { monthly: 999, annual: 9588 },
  pro: { monthly: 1999, annual: 19188 },
} as const
