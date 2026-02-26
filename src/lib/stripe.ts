import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }

  stripeInstance = new Stripe(secretKey)

  return stripeInstance
}

export const PRICE_IDS = {
  plus_monthly: process.env.NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID || '',
  plus_annual: process.env.NEXT_PUBLIC_STRIPE_PLUS_ANNUAL_PRICE_ID || '',
  pro_monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || '',
  pro_annual: process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID || '',
  credits_10: process.env.NEXT_PUBLIC_STRIPE_CREDITS_10_PRICE_ID || '',
  credits_30: process.env.NEXT_PUBLIC_STRIPE_CREDITS_30_PRICE_ID || '',
  credits_75: process.env.NEXT_PUBLIC_STRIPE_CREDITS_75_PRICE_ID || '',
  credits_150: process.env.NEXT_PUBLIC_STRIPE_CREDITS_150_PRICE_ID || '',
} as const

// Map a Stripe price ID back to plan + interval
export function planFromPriceId(priceId: string): { plan: 'plus' | 'pro'; interval: 'monthly' | 'annual' } | null {
  if (priceId === PRICE_IDS.plus_monthly) return { plan: 'plus', interval: 'monthly' }
  if (priceId === PRICE_IDS.plus_annual) return { plan: 'plus', interval: 'annual' }
  if (priceId === PRICE_IDS.pro_monthly) return { plan: 'pro', interval: 'monthly' }
  if (priceId === PRICE_IDS.pro_annual) return { plan: 'pro', interval: 'annual' }
  return null
}

// Map a Stripe price ID to credit amount
export function creditsFromPriceId(priceId: string): number | null {
  if (priceId === PRICE_IDS.credits_10) return 10
  if (priceId === PRICE_IDS.credits_30) return 30
  if (priceId === PRICE_IDS.credits_75) return 75
  if (priceId === PRICE_IDS.credits_150) return 150
  return null
}
