'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export default function ClosingCTA() {
  const { t } = useI18n()

  return (
    <section className="py-12">
      <div className="border-2 border-accent/20 rounded-card py-8 px-4 text-center">
        <h2 className="font-serif text-display-sm text-text-primary leading-tight">
          {t('closing_cta_title_1')}<br />{t('closing_cta_title_2')}
        </h2>
        <p className="text-body text-text-secondary mt-2 max-w-[320px] md:max-w-md mx-auto" style={{ textWrap: 'balance' } as React.CSSProperties}>
          {t('closing_cta_subtitle')}
        </p>
        <Link
          href="/app"
          className="inline-flex items-center justify-center gap-2 h-12 px-8 mt-6 bg-accent text-white text-body font-medium rounded-full hover:bg-accent-hover transition-all duration-200"
        >
          {t('landing_cta_v2')}
          <ArrowRight size={18} strokeWidth={2} />
        </Link>
      </div>
    </section>
  )
}
