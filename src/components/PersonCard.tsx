'use client'

import { MoreHorizontal } from 'lucide-react'
import { Person } from '@/types/analysis'
import { useI18n } from '@/lib/i18n'

interface PersonCardProps {
  person: Person
  analysisCount: number
  onClick: () => void
  onOptions?: () => void
}

export default function PersonCard({ person, analysisCount, onClick, onOptions }: PersonCardProps) {
  const { t } = useI18n()

  return (
    <div className="bg-bg-surface rounded-card border border-border hover:border-text-tertiary transition-all duration-200 group">
      <div className="flex items-center gap-3 py-2 px-4">
        <button
          onClick={onClick}
          className="flex items-center gap-3 flex-1 min-w-0 text-left min-h-[44px]"
        >
          <div className="w-9 h-9 rounded-full bg-bg-secondary flex items-center justify-center text-body font-medium text-text-tertiary flex-shrink-0 group-hover:bg-accent/5 transition-colors">
            {person.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <p className="text-body text-text-primary font-medium truncate">{person.name}</p>
            <p className="text-caption text-text-tertiary">
              {analysisCount} {t('analyses_count')}
            </p>
          </div>
        </button>

        {onOptions && (
          <button
            onClick={onOptions}
            className="flex-shrink-0 p-2 rounded-full hover:bg-bg-secondary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <MoreHorizontal size={20} strokeWidth={1.5} className="text-text-tertiary" />
          </button>
        )}
      </div>
    </div>
  )
}
