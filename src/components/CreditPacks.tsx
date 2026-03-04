'use client'

import { useI18n } from '@/lib/i18n'
import { CREDIT_PACKS } from '@/lib/usage'
import { Zap } from 'lucide-react'

interface CreditPacksProps {
  onBuy: (priceId: string) => void
  disabled?: boolean
}

export default function CreditPacks({ onBuy, disabled = false }: CreditPacksProps) {
  const { t } = useI18n()
  const pack = CREDIT_PACKS[0]

  return (
    <div id="credits">
      <h3 className="text-subtitle text-text-primary mb-2">{t('credits_title')}</h3>
      <p className="text-caption text-text-secondary mb-4">{t('credits_subtitle')}</p>

      <button
        onClick={() => onBuy(pack.priceId)}
        disabled={disabled}
        className="w-full rounded-card border border-border p-4 text-left transition-all hover:shadow-md hover:border-text-tertiary active:scale-[0.98]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={14} strokeWidth={2} className="text-warning" />
            <span className="text-body text-text-primary font-medium">
              {pack.label} {t('per_analysis')}
            </span>
          </div>
          <span className="text-subtitle text-text-primary">
            ${(pack.price / 100).toFixed(2)}
          </span>
        </div>
      </button>
    </div>
  )
}
