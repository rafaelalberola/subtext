import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function getProductMetadata(stripe: Stripe, priceId: string) {
  const price = await stripe.prices.retrieve(priceId, { expand: ['product'] })
  const product = price.product as Stripe.Product
  return {
    plan: product.metadata.plan as string | undefined,
    monthlyAnalyses: parseInt(product.metadata.monthly_analyses || '0'),
    credits: parseInt(product.metadata.credits || '0'),
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const stripe = getStripe()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      if (!userId) break

      if (session.mode === 'subscription') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub: any = await stripe.subscriptions.retrieve(
          session.subscription as string
        )
        const priceId = sub.items?.data?.[0]?.price?.id
        if (!priceId) break

        const meta = await getProductMetadata(stripe, priceId)
        const interval = sub.items?.data?.[0]?.price?.recurring?.interval === 'year'
          ? 'annual'
          : 'monthly'

        await supabase.from('user_subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: sub.id,
          plan: meta.plan || 'plus',
          billing_interval: interval,
          status: 'active',
          current_period_start: sub.current_period_start
            ? new Date(sub.current_period_start * 1000).toISOString()
            : new Date().toISOString(),
          current_period_end: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
          cancel_at_period_end: sub.cancel_at_period_end || false,
          updated_at: new Date().toISOString(),
        })
      } else if (session.mode === 'payment') {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
        const priceId = lineItems.data[0]?.price?.id
        if (!priceId) break

        const meta = await getProductMetadata(stripe, priceId)

        if (meta.plan === 'pack' && meta.credits > 0) {
          await supabase.from('credit_purchases').insert({
            user_id: userId,
            stripe_payment_intent_id: session.payment_intent as string,
            credits_amount: meta.credits,
            price_paid: session.amount_total || 0,
          })

          const { data: current } = await supabase
            .from('user_subscriptions')
            .select('bonus_credits')
            .eq('user_id', userId)
            .single()

          const currentCredits = current?.bonus_credits || 0

          await supabase.from('user_subscriptions').upsert({
            user_id: userId,
            bonus_credits: currentCredits + meta.credits,
            updated_at: new Date().toISOString(),
          })
        }
      }
      break
    }

    case 'customer.subscription.updated': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sub: any = event.data.object
      const userId = sub.metadata?.user_id
      if (!userId) break

      const priceId = sub.items?.data?.[0]?.price?.id
      if (!priceId) break

      const meta = await getProductMetadata(stripe, priceId)
      const interval = sub.items?.data?.[0]?.price?.recurring?.interval === 'year'
        ? 'annual'
        : 'monthly'

      const status = sub.status === 'active' ? 'active'
        : sub.status === 'past_due' ? 'past_due'
        : 'canceled'

      await supabase.from('user_subscriptions').update({
        plan: meta.plan || 'plus',
        billing_interval: interval,
        status,
        current_period_start: sub.current_period_start
          ? new Date(sub.current_period_start * 1000).toISOString()
          : undefined,
        current_period_end: sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : undefined,
        cancel_at_period_end: sub.cancel_at_period_end || false,
        updated_at: new Date().toISOString(),
      }).eq('user_id', userId)

      break
    }

    case 'customer.subscription.deleted': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sub: any = event.data.object
      const userId = sub.metadata?.user_id
      if (!userId) break

      await supabase.from('user_subscriptions').update({
        plan: 'free',
        status: 'canceled',
        stripe_subscription_id: null,
        billing_interval: null,
        cancel_at_period_end: false,
        updated_at: new Date().toISOString(),
      }).eq('user_id', userId)

      break
    }

    case 'invoice.payment_failed': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const failedInvoice: any = event.data.object
      const subscriptionId = failedInvoice.subscription as string
      if (!subscriptionId) break

      await supabase.from('user_subscriptions').update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      }).eq('stripe_subscription_id', subscriptionId)

      break
    }

    case 'invoice.payment_succeeded': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paidInvoice: any = event.data.object
      const subscriptionId = paidInvoice.subscription as string
      if (!subscriptionId) break

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sub: any = await stripe.subscriptions.retrieve(subscriptionId)

      await supabase.from('user_subscriptions').update({
        status: 'active',
        current_period_start: sub.current_period_start
          ? new Date(sub.current_period_start * 1000).toISOString()
          : undefined,
        current_period_end: sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : undefined,
        updated_at: new Date().toISOString(),
      }).eq('stripe_subscription_id', subscriptionId)

      break
    }
  }

  return NextResponse.json({ received: true })
}
