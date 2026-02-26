'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ConversationMockup from '@/components/chat/ConversationMockup'
import { useI18n } from '@/lib/i18n'

export default function HeroSection() {
  const { t } = useI18n()

  const heroText = t('landing_hero_v2')
  const accentWord = t('landing_hero_accent')
  const parts = heroText.split(accentWord)

  return (
    <section className="pt-12 pb-8">
      <div className="text-center mb-10">
        <h1 className="font-serif text-display text-text-primary leading-tight opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          {parts[0]}
          <span className="text-accent">{accentWord}</span>
          {parts[1]}
        </h1>
        <p className="text-body text-text-secondary mt-4 max-w-md mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          {t('landing_subtitle_v2')}
        </p>
        <Link
          href="/app"
          className="inline-flex items-center justify-center gap-2 h-14 px-8 mt-8 bg-accent text-white text-body font-medium rounded-full hover:bg-accent-hover active:bg-accent-hover transition-all duration-200 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
        >
          {t('landing_cta_v2')}
          <ArrowRight size={18} strokeWidth={2} />
        </Link>
      </div>

      <div className="rounded-card overflow-hidden shadow-xl">
        <ConversationMockup />
      </div>
    </section>
  )
}
