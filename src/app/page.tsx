'use client'

import Link from 'next/link'
import I18nProvider from '@/components/I18nProvider'
import { useI18n } from '@/lib/i18n'
import HeroSection from '@/components/landing/HeroSection'
import HowItWorks from '@/components/landing/HowItWorks'
import UseCases from '@/components/landing/UseCases'
import TrustSignals from '@/components/landing/TrustSignals'
import PricingSection from '@/components/landing/PricingSection'
import ClosingCTA from '@/components/landing/ClosingCTA'

function LandingContent() {
  const { t } = useI18n()

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-2xl mx-auto px-section">
        {/* Header */}
        <header className="flex items-center justify-between pt-6 pb-4">
          <span className="font-serif text-subtitle text-text-primary tracking-tight">Reveald</span>
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
        <PricingSection />
        <ClosingCTA />

        {/* Footer */}
        <footer className="pb-8 flex flex-col items-center gap-2">
          <p className="text-caption text-text-tertiary">
            {t('landing_footer')}
          </p>
          <div className="flex items-center gap-3 text-caption text-text-tertiary">
            <Link href="/privacy" className="hover:text-text-secondary transition-colors">
              {t('privacy_policy_title')}
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-text-secondary transition-colors">
              {t('terms_title')}
            </Link>
          </div>
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
