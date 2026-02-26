import type { PlanId, CreditPack } from '@/types/subscription'

export const PLAN_LIMITS: Record<PlanId, number> = {
  free: 5,
  plus: 75,
  pro: 300,
}

export const ALL_TONES = ['Direct', 'Warm', 'Playful', 'Professional', 'Cautious'] as const

export function getAllowedTones(plan: PlanId): string[] {
  if (plan === 'free') return ['Direct']
  return [...ALL_TONES]
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'credits_10',
    amount: 10,
    price: 299,
    label: '10',
    priceId: process.env.NEXT_PUBLIC_STRIPE_CREDITS_10_PRICE_ID || '',
    perAnalysis: '$0.30',
  },
  {
    id: 'credits_30',
    amount: 30,
    price: 699,
    label: '30',
    priceId: process.env.NEXT_PUBLIC_STRIPE_CREDITS_30_PRICE_ID || '',
    perAnalysis: '$0.23',
  },
  {
    id: 'credits_75',
    amount: 75,
    price: 1499,
    label: '75',
    priceId: process.env.NEXT_PUBLIC_STRIPE_CREDITS_75_PRICE_ID || '',
    perAnalysis: '$0.20',
  },
  {
    id: 'credits_150',
    amount: 150,
    price: 2499,
    label: '150',
    priceId: process.env.NEXT_PUBLIC_STRIPE_CREDITS_150_PRICE_ID || '',
    perAnalysis: '$0.17',
  },
]

export const PLAN_FEATURES: Record<PlanId, string[]> = {
  free: [
    'feature_5_analyses',
    'feature_basic_analysis',
    'feature_one_tone',
  ],
  plus: [
    'feature_75_analyses',
    'feature_full_analysis',
    'feature_all_tones',
    'feature_history',
    'feature_contact_labels',
  ],
  pro: [
    'feature_300_analyses',
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
  plus: { monthly: 699, annual: 5900 },
  pro: { monthly: 1299, annual: 10900 },
} as const
