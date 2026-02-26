import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { priceId, mode } = await request.json() as {
    priceId: string
    mode: 'subscription' | 'payment'
  }

  if (!priceId || !mode) {
    return NextResponse.json({ error: 'Missing priceId or mode' }, { status: 400 })
  }

  const stripe = getStripe()

  // Get or create Stripe customer
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: sub } = await admin
    .from('user_subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  let customerId = sub?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id },
    })
    customerId = customer.id

    // Upsert subscription record with customer ID
    await admin.from('user_subscriptions').upsert({
      user_id: user.id,
      stripe_customer_id: customerId,
      plan: 'free',
      status: 'active',
      bonus_credits: 0,
    })
  }

  const origin = request.headers.get('origin') || 'https://reveald.app'

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode,
    success_url: `${origin}/app?payment=success`,
    cancel_url: `${origin}/app/pricing`,
    metadata: { user_id: user.id },
  }

  if (mode === 'subscription') {
    sessionParams.subscription_data = {
      metadata: { user_id: user.id },
    }
  }

  const session = await stripe.checkout.sessions.create(sessionParams)

  return NextResponse.json({ url: session.url })
}
