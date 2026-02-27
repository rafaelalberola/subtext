'use client'

import { useState } from 'react'
import { Trash2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'
import { SavedAnalysis } from '@/types/analysis'
import Pill from '@/components/ui/Pill'
import ActionMenu from '@/components/ui/ActionMenu'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import AnalysisResults from '@/components/AnalysisResults'
import { useI18n } from '@/lib/i18n'
import type { PlanId } from '@/types/subscription'

const signalColors: Array<'blue' | 'purple' | 'pink' | 'orange' | 'green' | 'yellow'> = [
  'blue', 'purple', 'pink', 'orange', 'green', 'yellow',
]

interface HistoryListProps {
  analyses: SavedAnalysis[]
  onDelete: (id: string) => void
  plan?: PlanId
}

export default function HistoryList({ analyses, onDelete, plan = 'free' }: HistoryListProps) {
  const { t } = useI18n()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  if (analyses.length === 0) {
    return (
      <div className="text-center py-16 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center">
          <MessageSquare size={24} strokeWidth={1.5} className="text-text-tertiary" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-subtitle text-text-primary">{t('history_empty_title')}</p>
          <p className="text-body text-text-secondary">
            {t('history_empty_subtitle')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {analyses.map((item) => {
          const isExpanded = expandedId === item.id
          const signals = item.analysis_json.emotional_signals?.slice(0, 3) || []
          const date = new Date(item.created_at)
          const dateStr = date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })

          return (
            <div key={item.id} className="bg-bg-surface rounded-card border border-border hover:border-text-tertiary transition-colors duration-200 overflow-hidden">
              <div className="relative">
                {/* Summary row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="w-full p-4 pr-14 text-left flex items-start gap-3 min-h-[44px]"
                >
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-body text-text-primary truncate">
                      {item.contact_label && (
                        <span className="text-text-tertiary">{item.contact_label}: </span>
                      )}
                      {item.input_text.slice(0, 60)}
                      {item.input_text.length > 60 ? '...' : ''}
                    </p>
                    <p className="text-caption text-text-tertiary">{dateStr}</p>
                    {signals.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {signals.map((signal, i) => (
                          <Pill
                            key={i}
                            label={signal.signal}
                            emoji={signal.emoji}
                            color={signalColors[i % signalColors.length]}
                            className="text-[11px] px-2 py-0.5"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 pt-1">
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-text-tertiary" />
                    ) : (
                      <ChevronDown size={18} className="text-text-tertiary" />
                    )}
                  </div>
                </button>

                {/* Action menu */}
                <div className="absolute top-2 right-2">
                  <ActionMenu
                    items={[
                      {
                        label: t('delete_analysis'),
                        icon: <Trash2 size={16} strokeWidth={1.5} />,
                        onClick: () => setDeleteTarget(item.id),
                        variant: 'danger',
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-border p-4">
                  <AnalysisResults
                    analysis={item.analysis_json}
                    onBack={() => setExpandedId(null)}
                    plan={plan}
                    contactName={item.contact_label}
                    inputText={item.input_text}
                    createdAt={item.created_at}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            onDelete(deleteTarget)
            if (expandedId === deleteTarget) setExpandedId(null)
            setDeleteTarget(null)
          }
        }}
        title={t('confirm_delete_analysis_title')}
        description={t('confirm_delete_analysis_desc')}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        variant="danger"
      />
    </>
  )
}
