'use client'

import { useState } from 'react'
import { ArrowLeft, RotateCcw, Bookmark } from 'lucide-react'
import { AnalysisResult } from '@/types/analysis'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ConversationThread from '@/components/chat/ConversationThread'
import XRayToggle from '@/components/chat/XRayToggle'
import EmotionalSignals from '@/components/EmotionalSignals'
import SuggestedResponses from '@/components/SuggestedResponses'
import { useI18n } from '@/lib/i18n'

interface AnalysisResultsProps {
  analysis: AnalysisResult
  onBack: () => void
  onSave?: () => void
  showSave?: boolean
}

export default function AnalysisResults({
  analysis,
  onBack,
  onSave,
  showSave = true,
}: AnalysisResultsProps) {
  const { t } = useI18n()
  const [xrayEnabled, setXrayEnabled] = useState(true)

  return (
    <div className="space-y-card-gap">
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
      <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-subtitle text-text-primary">
            {t('card_decoded_title')}
          </h2>
          <XRayToggle enabled={xrayEnabled} onChange={setXrayEnabled} />
        </div>
        <ConversationThread
          pairs={analysis.decoded_pairs}
          showReveals={xrayEnabled}
          animated
        />
      </div>

      {/* Card 2: Emotional signals */}
      <Card animated delay={250}>
        <h2 className="text-subtitle text-text-primary mb-4">
          {t('card_signals_title')}
        </h2>
        <EmotionalSignals signals={analysis.emotional_signals} />
      </Card>

      {/* Card 3: Suggested responses */}
      <Card animated delay={400}>
        <h2 className="text-subtitle text-text-primary mb-4">
          {t('card_responses_title')}
        </h2>
        <SuggestedResponses responses={analysis.suggested_responses} />
      </Card>

      {/* Bottom actions */}
      <div
        className="flex flex-col gap-3 pt-2 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '550ms', animationFillMode: 'forwards' }}
      >
        <Button variant="secondary" fullWidth onClick={onBack}>
          <RotateCcw size={16} strokeWidth={1.5} />
          {t('analyze_another')}
        </Button>
        {showSave && onSave && (
          <button
            onClick={onSave}
            className="flex items-center justify-center gap-2 text-body text-text-tertiary hover:text-accent transition-colors py-3"
          >
            <Bookmark size={16} strokeWidth={1.5} />
            {t('save_analysis')}
          </button>
        )}
      </div>
    </div>
  )
}
