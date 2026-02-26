'use client'

import { Shield, Zap, Globe } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export default function TrustSignals() {
  const { t } = useI18n()

  const signals = [
    { icon: Shield, label: t('trust_private') },
    { icon: Zap, label: t('trust_ai') },
    { icon: Globe, label: t('trust_languages') },
  ]

  return (
    <section className="py-8">
      <div className="flex flex-wrap justify-center gap-4">
        {signals.map((s, i) => {
          const Icon = s.icon
          return (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-bg-surface border border-border text-caption text-text-secondary font-medium"
            >
              <Icon size={14} strokeWidth={1.5} />
              {s.label}
            </div>
          )
        })}
      </div>
    </section>
  )
}
