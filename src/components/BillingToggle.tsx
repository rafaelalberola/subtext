'use client'

import { useI18n } from '@/lib/i18n'
import type { BillingInterval } from '@/types/subscription'

interface BillingToggleProps {
  interval: BillingInterval
  onChange: (interval: BillingInterval) => void
}

export default function BillingToggle({ interval, onChange }: BillingToggleProps) {
  const { t } = useI18n()

  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex items-center bg-bg-secondary rounded-pill p-1">
        <button
          onClick={() => onChange('monthly')}
          className={`px-4 py-1.5 rounded-pill text-caption font-medium transition-all ${
            interval === 'monthly'
              ? 'bg-white text-text-primary shadow-sm'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
        >
          {t('billing_monthly')}
        </button>
        <button
          onClick={() => onChange('annual')}
          className={`pl-4 pr-2 py-1.5 rounded-pill text-caption font-medium transition-all flex items-center gap-1.5 ${
            interval === 'annual'
              ? 'bg-white text-text-primary shadow-sm'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
        >
          {t('billing_annual')}
          <span className="text-[11px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-pill">
            {t('billing_save_30')}
          </span>
        </button>
      </div>
    </div>
  )
}
