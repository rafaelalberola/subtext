'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import I18nProvider from '@/components/I18nProvider'
import { useI18n } from '@/lib/i18n'
import HeroSection from '@/components/landing/HeroSection'
import HowItWorks from '@/components/landing/HowItWorks'
import UseCases from '@/components/landing/UseCases'
import TrustSignals from '@/components/landing/TrustSignals'
import PricingSection from '@/components/landing/PricingSection'
import ClosingCTA from '@/components/landing/ClosingCTA'
import AnalysisResults from '@/components/AnalysisResults'
import PostAnalysisSignupModal from '@/components/PostAnalysisSignupModal'
import { ThinkingIndicator } from '@/components/ui/Skeleton'
import { getFingerprint } from '@/lib/fingerprint'
import { analytics } from '@/lib/analytics'
import type { AnalysisResult } from '@/types/analysis'

const FREE_ANALYSIS_STORAGE_KEY = 'reveald_free_analysis'

type LandingView = 'idle' | 'loading' | 'results'

function LandingContent() {
  const { t } = useI18n()
  const [landingView, setLandingView] = useState<LandingView>('idle')
  const [freeAnalysis, setFreeAnalysis] = useState<AnalysisResult | null>(null)
  const [freeAnalysisId, setFreeAnalysisId] = useState<string | null>(null)
  const [inputText, setInputText] = useState('')
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-show signup modal 2s after results appear
  useEffect(() => {
    if (landingView !== 'results') return
    const timer = setTimeout(() => {
      setShowSignupModal(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [landingView])

  const handleFreeSubmit = async (data: { text?: string; screenshot?: string; honeypot?: string }) => {
    setError(null)
    setInputText(data.text || '[Screenshot]')

    analytics.freeAnalysisStarted()
    setLandingView('loading')

    try {
      const fingerprint = await getFingerprint()

      const res = await fetch('/api/free-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: data.text,
          screenshot: data.screenshot,
          fingerprint,
          honeypot: data.honeypot,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        const errorKey = errorData.error || ''
        // Check if the error is an i18n key
        if (errorKey.startsWith('free_analysis_error_')) {
          setError(errorKey)
        } else {
          setError(errorKey || 'Something went wrong. Please try again.')
        }
        setLandingView('idle')
        return
      }

      const result = await res.json()
      setFreeAnalysis(result.analysis)
      setFreeAnalysisId(result.freeAnalysisId)
      setLandingView('results')
      analytics.freeAnalysisCompleted()

      // Store in sessionStorage for post-signup claim
      try {
        sessionStorage.setItem(FREE_ANALYSIS_STORAGE_KEY, JSON.stringify({
          freeAnalysisId: result.freeAnalysisId,
          analysis: result.analysis,
          inputText: data.text || '[Screenshot]',
          inputType: data.screenshot ? 'screenshot' : 'text',
        }))
      } catch {
        // sessionStorage may be unavailable
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLandingView('idle')
    }
  }

  const handleBackToLanding = () => {
    setLandingView('idle')
    setFreeAnalysis(null)
    setFreeAnalysisId(null)
    setShowSignupModal(false)
  }

  // Results view: show analysis + signup modal
  if (landingView === 'results' && freeAnalysis) {
    return (
      <main className="min-h-screen bg-bg-primary">
        <div className="max-w-2xl mx-auto px-section">
          {/* Minimal header */}
          <header className="flex items-center justify-between pt-6 pb-4 border-b border-border -mx-section px-section">
            <span className="flex items-center gap-1.5 font-serif text-[22px] text-text-primary tracking-tight"><MessageCircle size={18} strokeWidth={1.5} className="relative -top-[2px]" />Reveald</span>
            <button
              onClick={() => setShowSignupModal(true)}
              className="text-caption text-accent font-medium underline hover:text-accent-hover transition-colors"
            >
              {t('create_account')}
            </button>
          </header>

          <div className="pb-8 pt-4">
            <AnalysisResults
              analysis={freeAnalysis}
              onBack={handleBackToLanding}
              plan="pro"
              inputText={inputText}
            />
          </div>
        </div>

        <PostAnalysisSignupModal
          open={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          freeAnalysisId={freeAnalysisId}
        />
      </main>
    )
  }

  // Loading view
  if (landingView === 'loading') {
    return (
      <main className="min-h-screen bg-bg-primary">
        <div className="max-w-2xl mx-auto px-section">
          <header className="flex items-center justify-between pt-6 pb-4">
            <span className="flex items-center gap-1.5 font-serif text-[22px] text-text-primary tracking-tight"><MessageCircle size={18} strokeWidth={1.5} className="relative -top-[2px]" />Reveald</span>
          </header>
          <ThinkingIndicator />
        </div>
      </main>
    )
  }

  // Idle view: full landing page with input
  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-2xl mx-auto px-section">
        {/* Header */}
        <header className="flex items-center justify-between pt-6 pb-4">
          <span className="flex items-center gap-1.5 font-serif text-[22px] text-text-primary tracking-tight"><MessageCircle size={18} strokeWidth={1.5} className="relative -top-[2px]" />Reveald</span>
          <Link
            href="/app"
            className="text-caption font-medium text-white bg-accent hover:bg-accent-hover px-4 py-2 rounded-full transition-colors"
          >
            {t('get_started')}
          </Link>
        </header>

        <HeroSection
          onSubmit={handleFreeSubmit}
          isLoading={false}
          error={error}
        />
        <HowItWorks />
        <UseCases />
        <TrustSignals />
        <PricingSection />
        <ClosingCTA />

        {/* Footer */}
        <footer className="pb-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 text-caption text-text-tertiary">
            <Link href="/privacy" className="underline hover:text-text-secondary transition-colors">
              {t('privacy_policy_title')}
            </Link>
            <span>·</span>
            <Link href="/terms" className="underline hover:text-text-secondary transition-colors">
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
