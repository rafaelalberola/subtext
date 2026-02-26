'use client'

import Link from 'next/link'
import I18nProvider from '@/components/I18nProvider'
import { useI18n } from '@/lib/i18n'
import HeroSection from '@/components/landing/HeroSection'
import HowItWorks from '@/components/landing/HowItWorks'
import UseCases from '@/components/landing/UseCases'
import TrustSignals from '@/components/landing/TrustSignals'
import ClosingCTA from '@/components/landing/ClosingCTA'

function LandingContent() {
  const { t } = useI18n()

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-2xl mx-auto px-section">
        {/* Header */}
        <header className="flex items-center justify-between pt-6 pb-4">
          <span className="font-serif text-subtitle text-text-primary tracking-tight">Subtext</span>
          <Link
            href="/app"
            className="text-caption text-accent font-medium hover:text-accent-hover transition-colors"
          >
            {t('open_app')}
          </Link>
        </header>

        <HeroSection />
        <HowItWorks />
        <UseCases />
        <TrustSignals />
        <ClosingCTA />

        {/* Footer */}
        <footer className="pb-8 text-center">
          <p className="text-caption text-text-tertiary">
            {t('landing_footer')}
          </p>
        </footer>
      </div>
    </main>
  )
}

export default function LandingPage() {
  return (
    <I18nProvider>
      <LandingContent />
    </I18nProvider>
  )
}
