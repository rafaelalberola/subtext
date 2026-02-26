'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { useSubscription } from '@/lib/subscription-context'
import { analytics } from '@/lib/analytics'
import BillingToggle from '@/components/BillingToggle'
import PricingCards from '@/components/PricingCards'
import CreditPacks from '@/components/CreditPacks'
import PlanBadge from '@/components/PlanBadge'
import { ChevronDown } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import type { PlanId, BillingInterval } from '@/types/subscription'

const PRICE_MAP: Record<string, string> = {
  plus_monthly: process.env.NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID || '',
  plus_annual: process.env.NEXT_PUBLIC_STRIPE_PLUS_ANNUAL_PRICE_ID || '',
  pro_monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || '',
  pro_annual: process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID || '',
}

export default function PricingPage() {
  const { t } = useI18n()
  const { usage } = useSubscription()
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly')
  const [loading, setLoading] = useState(false)

  const currentPlan: PlanId = usage?.plan || 'free'

  const handleSelectPlan = async (plan: PlanId, interval: BillingInterval) => {
    if (plan === 'free') return
    setLoading(true)

    const priceId = PRICE_MAP[`${plan}_${interval}`]
    analytics.initiateCheckout(plan, 0)

    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, mode: 'subscription' }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      setLoading(false)
    }
  }

  const handleBuyCredits = async (priceId: string) => {
    setLoading(true)
    analytics.initiateCheckout('credits', 0)

    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, mode: 'payment' }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      <PageHeader
        onBack={() => window.history.back()}
        title={t('pricing_title')}
        subtitle={`${t('pricing_subtitle_1')} ${t('pricing_subtitle_2')}`}
      />

      {/* Toggle */}
      <BillingToggle interval={billingInterval} onChange={setBillingInterval} />

      {/* Plans */}
      <PricingCards
        currentPlan={currentPlan}
        billingInterval={billingInterval}
        onSelectPlan={handleSelectPlan}
        disabled={loading}
      />

      {/* Credits */}
      <CreditPacks onBuy={handleBuyCredits} disabled={loading} />

      {/* FAQ */}
      <div>
        <h3 className="text-subtitle text-text-primary mb-4">{t('faq_title')}</h3>
        <div className="flex flex-col gap-2">
          <FAQItem
            question={t('faq_cancel_q')}
            answer={t('faq_cancel_a')}
          />
          <FAQItem
            question={t('faq_credits_q')}
            answer={t('faq_credits_a')}
          />
          <FAQItem
            question={t('faq_switch_q')}
            answer={t('faq_switch_a')}
          />
          <FAQItem
            question={t('faq_run_out_q')}
            answer={t('faq_run_out_a')}
          />
        </div>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-border rounded-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left min-h-[44px]"
      >
        <span className="text-body text-text-primary font-medium">{question}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={`text-text-tertiary transition-transform flex-shrink-0 ml-2 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 -mt-1">
          <p className="text-body text-text-secondary">{answer}</p>
        </div>
      )}
    </div>
  )
}
