'use client'

import { useI18n } from '@/lib/i18n'
import BottomSheet from '@/components/ui/BottomSheet'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

interface UpgradePromptProps {
  open: boolean
  onClose: () => void
}

export default function UpgradePrompt({ open, onClose }: UpgradePromptProps) {
  const { t } = useI18n()

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="text-center flex flex-col items-center gap-5 pb-4">
        <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
          <Sparkles size={24} strokeWidth={1.5} className="text-accent" />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-title text-text-primary">
            {t('upgrade_prompt_title')}
          </h3>
          <p className="text-body text-text-secondary">
            {t('upgrade_prompt_subtitle')}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Link href="/app/pricing" onClick={onClose}>
            <Button variant="primary" fullWidth>
              {t('upgrade_prompt_see_plans')}
              <ArrowRight size={16} strokeWidth={1.5} />
            </Button>
          </Link>

          <Link href="/app/pricing#credits" onClick={onClose}>
            <Button variant="secondary" fullWidth>
              {t('upgrade_prompt_buy_credits')}
            </Button>
          </Link>
        </div>
      </div>
    </BottomSheet>
  )
}

// Inline banner for when user has 1 analysis remaining
export function LowUsageBanner() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-3 bg-warning/10 border border-warning/20 rounded-card text-caption">
      <span className="text-text-secondary">{t('usage_last_analysis')}</span>
      <Link
        href="/app/pricing"
        className="text-accent font-medium underline hover:text-accent-hover transition-colors"
      >
        {t('see_plans')}
      </Link>
    </div>
  )
}
