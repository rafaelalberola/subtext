'use client'

import { useI18n } from '@/lib/i18n'

const steps = [
  { titleKey: 'how_step_1_title', descKey: 'how_step_1_desc' },
  { titleKey: 'how_step_2_title', descKey: 'how_step_2_desc' },
  { titleKey: 'how_step_3_title', descKey: 'how_step_3_desc' },
] as const

export default function HowItWorks() {
  const { t } = useI18n()

  return (
    <section className="py-12">
      <h2 className="font-serif text-display-sm text-text-primary text-center mb-8">
        {t('how_it_works_title')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {steps.map((step, i) => (
          <div key={i} className="text-center bg-bg-surface rounded-card p-5 border border-border hover:border-text-tertiary transition-colors duration-200">
            <div className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-3">
              <span className="text-title text-text-primary font-semibold">{i + 1}</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-subtitle text-text-primary">
                {t(step.titleKey as any)}
              </h3>
              <p className="text-caption text-text-secondary" style={{ textWrap: 'balance' } as React.CSSProperties}>
                {t(step.descKey as any)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
