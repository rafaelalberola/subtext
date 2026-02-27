'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import BillingToggle from '@/components/BillingToggle'
import PricingCards from '@/components/PricingCards'
import type { BillingInterval } from '@/types/subscription'

export default function PricingSection() {
  const { t } = useI18n()
  const router = useRouter()
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly')

  const handleSelectPlan = () => {
    router.push('/app')
  }

  return (
    <section className="py-section-gap">
      <div className="text-center mb-8 flex flex-col gap-2">
        <h2 className="font-serif text-display-sm text-text-primary">
          {t('pricing_landing_title')}
        </h2>
        <p className="text-body text-text-secondary">
          {t('pricing_landing_subtitle')}
        </p>
      </div>

      <BillingToggle interval={billingInterval} onChange={setBillingInterval} />

      <div className="mt-6">
        <PricingCards
          currentPlan="free"
          billingInterval={billingInterval}
          onSelectPlan={handleSelectPlan}
          landingMode
        />
      </div>

      <p className="text-center text-caption text-text-tertiary mt-6">
        {t('pricing_no_cc')}
      </p>
    </section>
  )
}
