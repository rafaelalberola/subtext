'use client'

import { useState } from 'react'
import { Copy, ChevronDown, ChevronUp, Lock, ArrowRight } from 'lucide-react'
import { SuggestedResponse } from '@/types/analysis'
import { TonePill } from '@/components/ui/Pill'
import { useToast } from '@/components/ui/Toast'
import { useI18n } from '@/lib/i18n'
import { ALL_TONES, getAllowedTones } from '@/lib/usage'
import type { PlanId } from '@/types/subscription'

interface SuggestedResponsesProps {
  responses: SuggestedResponse[]
  lockedTones?: SuggestedResponse['tone'][]
  plan?: PlanId
}

export default function SuggestedResponses({ responses, lockedTones, plan = 'free' }: SuggestedResponsesProps) {
  const allowed = getAllowedTones(plan)
  const targetPlan: PlanId = plan === 'free' ? 'plus' : 'pro'

  // Split responses into unlocked (plan allows) and locked (plan doesn't)
  const unlocked = responses.filter(r => allowed.includes(r.tone))
  const lockedFromResponses = responses.filter(r => !allowed.includes(r.tone))

  // For tones not returned by Claude at all, show them as locked too (if plan doesn't allow)
  const returnedTones = responses.map(r => r.tone)
  const missingLockedTones = (lockedTones && lockedTones.length > 0)
    ? lockedTones.filter(t => !returnedTones.includes(t))
    : ALL_TONES.filter(t => !allowed.includes(t) && !returnedTones.includes(t))

  return (
    <div className="flex flex-col gap-3">
      {unlocked.map((response, i) => (
        <ResponseCard key={i} response={response} />
      ))}
      {lockedFromResponses.map((response) => (
        <LockedResponseCard key={response.tone} tone={response.tone} targetPlan={targetPlan} />
      ))}
      {missingLockedTones.map((tone) => (
        <LockedResponseCard key={tone} tone={tone as SuggestedResponse['tone']} targetPlan={targetPlan} />
      ))}
    </div>
  )
}

function ResponseCard({ response }: { response: SuggestedResponse }) {
  const [expanded, setExpanded] = useState(false)
  const { showToast } = useToast()
  const { t } = useI18n()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response.message)
      showToast(t('copied'))
    } catch {
      showToast(t('copy_failed'))
    }
  }

  return (
    <div className="border border-border rounded-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <TonePill tone={response.tone} />
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-caption text-text-tertiary hover:text-accent transition-colors min-h-[44px] px-2"
        >
          <Copy size={14} strokeWidth={1.5} />
          {t('copy')}
        </button>
      </div>

      <p className="text-body text-text-primary">{response.message}</p>

      <div className="border-t border-border -mx-4" />
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-caption text-text-tertiary hover:text-text-secondary transition-colors"
      >
        {expanded ? (
          <>
            <ChevronUp size={14} strokeWidth={1.5} />
            {t('less')}
          </>
        ) : (
          <>
            <ChevronDown size={14} strokeWidth={1.5} />
            {t('why_this_tone')}
          </>
        )}
      </button>

      {expanded && (
        <p className="text-caption text-text-secondary animate-fade-in">
          {response.why}
        </p>
      )}
    </div>
  )
}

function LockedResponseCard({ tone, targetPlan }: { tone: SuggestedResponse['tone']; targetPlan: PlanId }) {
  const { t } = useI18n()

  const upgradeLabel = targetPlan === 'plus' ? t('upgrade_to_plus') : t('upgrade_to_pro')

  const handleUpgrade = () => {
    // Persist current page state in sessionStorage before navigating
    sessionStorage.setItem('reveald_return_to', window.location.pathname)
    window.location.href = '/app/pricing'
  }

  return (
    <div className="border border-border rounded-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <TonePill tone={tone} />
        <span className="flex items-center gap-1.5 text-caption text-text-tertiary">
          <Lock size={12} strokeWidth={1.5} />
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-4 bg-bg-secondary rounded w-3/4" />
        <div className="h-4 bg-bg-secondary rounded w-1/2" />
      </div>
      <button
        onClick={handleUpgrade}
        className="flex items-center justify-center gap-2 text-caption font-medium text-white bg-accent hover:bg-accent-hover rounded-button py-2.5 transition-colors"
      >
        {upgradeLabel}
        <ArrowRight size={14} strokeWidth={1.5} />
      </button>
    </div>
  )
}
