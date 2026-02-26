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

  return (
    <div id="credits">
      <h3 className="text-subtitle text-text-primary mb-2">{t('credits_title')}</h3>
      <p className="text-caption text-text-secondary mb-4">{t('credits_subtitle')}</p>

      <div className="grid grid-cols-2 gap-3">
        {CREDIT_PACKS.map((pack) => {
          const isBestValue = pack.id === 'credits_75'

          return (
            <button
              key={pack.id}
              onClick={() => onBuy(pack.priceId)}
              disabled={disabled}
              className={`relative rounded-card border p-4 text-left transition-all hover:shadow-md active:scale-[0.98] ${
                isBestValue
                  ? 'border-accent bg-accent/5'
                  : 'border-border hover:border-text-tertiary'
              }`}
            >
              {isBestValue && (
                <span className="absolute -top-2.5 right-3 text-[10px] font-semibold text-white bg-accent px-2 py-0.5 rounded-pill">
                  {t('best_value')}
                </span>
              )}

              <div className="flex items-center gap-1.5 mb-2">
                <Zap size={14} strokeWidth={2} className="text-warning" />
                <span className="text-subtitle text-text-primary">{pack.label}</span>
              </div>

              <div className="text-title text-text-primary">
                ${(pack.price / 100).toFixed(2)}
              </div>

            </button>
          )
        })}
      </div>
    </div>
  )
}
