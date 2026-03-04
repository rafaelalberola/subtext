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
} as const
