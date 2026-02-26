'use client'

import { Bookmark } from 'lucide-react'
import { AnalysisResult } from '@/types/analysis'
import Card from '@/components/ui/Card'
import PageHeader from '@/components/ui/PageHeader'
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
  inputText?: string
  createdAt?: string
}

export default function AnalysisResults({
  analysis,
  onBack,
  onSave,
  showSave = true,
  plan = 'free',
  contactName,
  inputText,
  createdAt,
}: AnalysisResultsProps) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-card-gap">
      <PageHeader
        onBack={onBack}
        title={inputText
          ? (inputText.length > 60 ? inputText.slice(0, 60) + '...' : inputText)
          : t('nav_analyze')
        }
      />

      {/* Date with separators */}
      {createdAt && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <p className="text-caption text-text-tertiary whitespace-nowrap">
            {new Date(createdAt).toLocaleDateString(analysis.language === 'es' ? 'es-ES' : 'en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <div className="flex-1 h-px bg-border" />
        </div>
      )}

      {/* Decoded conversation */}
      <div className="opacity-0 animate-fade-in-up flex flex-col gap-3" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
        <div className="rounded-card bg-[#f1efeb] p-3">
          <ConversationThread
            pairs={analysis.decoded_pairs}
            showReveals={true}
            animated
            contactName={contactName}
          />
        </div>
      </div>

      {/* Overall read */}
      <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <p className="text-body text-text-secondary leading-relaxed pl-[3px]">
          {analysis.overall_read}
        </p>
      </div>

      {/* Card 2: Emotional signals */}
      <Card animated delay={250} className="flex flex-col gap-4 !p-3">
        <EmotionalSignals signals={analysis.emotional_signals} />
      </Card>

      {/* Card 3: Suggested responses */}
      <Card animated delay={400} className="flex flex-col gap-4 !p-3 !mb-0">
        <h2 className="text-subtitle text-text-primary">{t('card_responses_title')}</h2>
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
