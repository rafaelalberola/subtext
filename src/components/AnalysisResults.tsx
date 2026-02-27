'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { AnalysisResult } from '@/types/analysis'
import Card from '@/components/ui/Card'
import PageHeader from '@/components/ui/PageHeader'
import ConversationThread from '@/components/chat/ConversationThread'
import EmotionalSignals from '@/components/EmotionalSignals'
import SuggestedResponses from '@/components/SuggestedResponses'
import { useI18n } from '@/lib/i18n'
import type { PlanId } from '@/types/subscription'

interface AnalysisResultsProps {
  analysis: AnalysisResult
  onBack: () => void
  plan?: PlanId
  contactName?: string
  personId?: string
  inputText?: string
  createdAt?: string
  headerAction?: React.ReactNode
}

export default function AnalysisResults({
  analysis,
  onBack,
  plan = 'free',
  contactName,
  personId,
  inputText,
  createdAt,
  headerAction,
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
        action={headerAction}
      />

      <div className="max-w-2xl mx-auto w-full flex flex-col gap-card-gap">
        {/* Person banner card */}
        {contactName && (
          <Link
            href={personId ? `/app/people?person=${personId}` : '/app/people'}
            className="flex items-center gap-3 py-2 px-4 rounded-card bg-bg-surface border border-border hover:border-text-tertiary transition-all duration-200 group"
          >
            <span className="flex-shrink-0 w-9 h-9 rounded-full bg-bg-secondary flex items-center justify-center text-body font-medium text-text-tertiary group-hover:bg-accent/5 transition-colors">
              {contactName?.charAt(0).toUpperCase()}
            </span>
            <p className="text-body font-medium text-text-primary truncate flex-1">{contactName}</p>
            <ChevronRight size={18} strokeWidth={1.5} className="flex-shrink-0 text-text-tertiary" />
          </Link>
        )}

        {/* Date separator */}
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

        <div className="h-px" style={{ backgroundColor: 'rgb(225 225 225 / 70%)' }} />

        {/* Overall read */}
        <div className="opacity-0 animate-fade-in-up flex flex-col gap-2" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <h2 className="text-subtitle text-text-primary">{t('card_overall_title')}</h2>
          <p className="text-body text-text-secondary leading-relaxed">
            {analysis.overall_read}
          </p>
        </div>

        {/* Emotional signals */}
        <div className="opacity-0 animate-fade-in-up flex flex-col gap-3" style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}>
          <h2 className="text-subtitle text-text-primary">{t('card_signals_title')}</h2>
          <Card className="flex flex-col gap-4 !p-4">
            <EmotionalSignals signals={analysis.emotional_signals} />
          </Card>
        </div>

        {/* Suggested responses */}
        <div className="opacity-0 animate-fade-in-up flex flex-col gap-3" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <h2 className="text-subtitle text-text-primary">{t('card_responses_title')}</h2>
          <SuggestedResponses
            responses={analysis.suggested_responses}
            plan={plan}
          />
        </div>

      </div>
    </div>
  )
}
