'use client'

import { Check } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { PLAN_FEATURES, PLAN_PRICES } from '@/lib/usage'
import type { PlanId, BillingInterval } from '@/types/subscription'
import type { TranslationKey } from '@/lib/i18n'

interface PricingCardsProps {
  currentPlan: PlanId
  billingInterval: BillingInterval
  onSelectPlan: (plan: PlanId, interval: BillingInterval) => void
  disabled?: boolean
  /** Landing mode: show CTA on all plans with "Start now" text */
  landingMode?: boolean
}

const plans: Array<{
  id: PlanId
  nameKey: TranslationKey
  highlighted: boolean
  badgeKey?: TranslationKey
}> = [
  { id: 'free', nameKey: 'plan_free', highlighted: false },
  { id: 'plus', nameKey: 'plan_plus', highlighted: true, badgeKey: 'plan_most_popular' },
  { id: 'pro', nameKey: 'plan_pro', highlighted: false },
]

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}€`
}

export default function PricingCards({
  currentPlan,
  billingInterval,
  onSelectPlan,
  disabled = false,
  landingMode = false,
}: PricingCardsProps) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-4">
      {plans.map((plan) => {
        const isCurrent = currentPlan === plan.id
        const prices = PLAN_PRICES[plan.id]
        // Always show per-month price; for annual, divide by 12
        const displayPrice = billingInterval === 'annual'
          ? Math.round(prices.annual / 12)
          : prices.monthly
        const features = PLAN_FEATURES[plan.id]

        return (
          <div
            key={plan.id}
            className={`relative rounded-card p-5 border transition-all ${
              plan.highlighted
                ? 'border-accent shadow-md'
                : 'border-border'
            }`}
          >
            {plan.badgeKey && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-accent text-white text-[11px] font-semibold px-3 py-1 rounded-pill">
                  {t(plan.badgeKey)}
                </span>
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-subtitle text-text-primary">{t(plan.nameKey)}</h3>
                <div className="mt-1">
                  {displayPrice === 0 ? (
                    <span className="text-title text-text-primary">0€</span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-title text-text-primary">
                        {formatPrice(displayPrice)}
                      </span>
                      <span className="text-caption text-text-tertiary">
                        /{t('billing_month')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <ul className="flex flex-col gap-2.5 mb-5">
              {features.map((featureKey) => (
                <li key={featureKey} className="flex items-start gap-2.5">
                  <Check
                    size={16}
                    strokeWidth={2}
                    className={`mt-0.5 flex-shrink-0 ${
                      plan.highlighted ? 'text-accent' : 'text-success'
                    }`}
                  />
                  <span className="text-body text-text-secondary">
                    {t(featureKey as TranslationKey)}
                  </span>
                </li>
              ))}
            </ul>

            {isCurrent && !landingMode ? (
              <p className="text-center text-caption text-text-tertiary font-medium py-2">
                {t('current_plan')}
              </p>
            ) : !landingMode && plan.id === 'free' ? (
              <div />
            ) : (
              <button
                className={`w-full py-3 rounded-button text-body font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-accent text-white hover:bg-accent-hover'
                    : 'bg-bg-secondary text-text-primary hover:bg-border'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => onSelectPlan(plan.id, billingInterval)}
                disabled={disabled}
              >
                {landingMode ? t('cta_start_now') : `${t('upgrade_to')} ${t(plan.nameKey)}`}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
