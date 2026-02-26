'use client'

import { ArrowLeft, Bookmark } from 'lucide-react'
import { AnalysisResult } from '@/types/analysis'
import Card from '@/components/ui/Card'
import ConversationThread from '@/components/chat/ConversationThread'
import EmotionalSignals from '@/components/EmotionalSignals'
import SuggestedResponses from '@/components/SuggestedResponses'
import { useI18n } from '@/lib/i18n'
import { getAllowedTones, ALL_TONES } from '@/lib/usage'
import type { PlanId } from '@/types/subscription'

interface AnalysisResultsProps {
  analysis: AnalysisResult
  onBack: () => void
  onSave?: () => void
  showSave?: boolean
  plan?: PlanId
  contactName?: string
}

export default function AnalysisResults({
  analysis,
  onBack,
  onSave,
  showSave = true,
  plan = 'free',
  contactName,
}: AnalysisResultsProps) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-card-gap">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-body text-text-secondary hover:text-text-primary transition-colors min-h-[44px]"
      >
        <ArrowLeft size={18} strokeWidth={1.5} />
        {t('back')}
      </button>

      {/* Overall read */}
      <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
        <p className="text-body text-text-secondary leading-relaxed">
          {analysis.overall_read}
        </p>
      </div>

      {/* Decoded conversation */}
      <div className="opacity-0 animate-fade-in-up flex flex-col gap-3" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <h2 className="text-subtitle text-text-primary">
          {t('card_decoded_title')}
        </h2>
        <div className="rounded-card bg-[#f1efeb] p-3">
          <ConversationThread
            pairs={analysis.decoded_pairs}
            showReveals={true}
            animated
            contactName={contactName}
          />
        </div>
      </div>

      {/* Card 2: Emotional signals */}
      <Card animated delay={250} className="flex flex-col gap-4">
        <h2 className="text-subtitle text-text-primary">
          {t('card_signals_title')}
        </h2>
        <EmotionalSignals signals={analysis.emotional_signals} />
      </Card>

      {/* Card 3: Suggested responses */}
      <Card animated delay={400} className="flex flex-col gap-4">
        <h2 className="text-subtitle text-text-primary">
          {t('card_responses_title')}
        </h2>
        <SuggestedResponses
          responses={analysis.suggested_responses}
          lockedTones={plan === 'free'
            ? ALL_TONES.filter(t => !getAllowedTones(plan).includes(t))
            : undefined
          }
          plan={plan}
        />
      </Card>

      {/* Save action */}
      {showSave && onSave && (
        <div
          className="flex flex-col gap-3 pt-2 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '550ms', animationFillMode: 'forwards' }}
        >
          <button
            onClick={onSave}
            className="flex items-center justify-center gap-2 text-body text-text-tertiary hover:text-accent transition-colors py-3"
          >
            <Bookmark size={16} strokeWidth={1.5} />
            {t('save_analysis')}
          </button>
        </div>
      )}
    </div>
  )
}
