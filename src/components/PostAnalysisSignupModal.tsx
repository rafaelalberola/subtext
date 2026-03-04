'use client'

import { useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import BottomSheet from '@/components/ui/BottomSheet'
import AuthPrompt from '@/components/AuthPrompt'
import { useI18n } from '@/lib/i18n'
import { analytics } from '@/lib/analytics'

interface PostAnalysisSignupModalProps {
  open: boolean
  onClose: () => void
  freeAnalysisId: string | null
}

export default function PostAnalysisSignupModal({
  open,
  onClose,
  freeAnalysisId,
}: PostAnalysisSignupModalProps) {
  const { t } = useI18n()

  useEffect(() => {
    if (open) {
      analytics.postAnalysisSignupShown()
    }
  }, [open])

  const handleDismiss = () => {
    analytics.postAnalysisSignupDismissed()
    onClose()
  }

  const claimParam = freeAnalysisId ? `?claim=${freeAnalysisId}` : ''
  const redirectUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/app${claimParam}`
    : `/app${claimParam}`

  return (
    <BottomSheet open={open} onClose={handleDismiss}>
      <div className="text-center flex flex-col items-center gap-5 pb-4">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mt-4">
          <Sparkles size={24} strokeWidth={1.5} className="text-success" />
        </div>

        {/* Title + subtitle */}
        <div className="flex flex-col gap-2 max-w-[260px]">
          <h3 className="text-subtitle text-text-primary">
            {t('post_analysis_signup_title')}
          </h3>
          <p className="text-body text-text-secondary">
            {t('post_analysis_signup_subtitle')}
          </p>
        </div>

        {/* Auth options */}
        <div className="w-full">
          <AuthPrompt redirectTo={redirectUrl} />
        </div>

        {/* Dismiss option */}
        <button
          onClick={handleDismiss}
          className="text-caption text-text-tertiary hover:text-text-secondary transition-colors py-2"
        >
          {t('post_analysis_dismiss')}
        </button>
      </div>
    </BottomSheet>
  )
}
