'use client'

import { Trash2, ChevronRight } from 'lucide-react'
import { Person } from '@/types/analysis'
import ActionMenu from '@/components/ui/ActionMenu'
import { useI18n } from '@/lib/i18n'

interface PersonCardProps {
  person: Person
  analysisCount: number
  onClick: () => void
  onDelete?: () => void
}

export default function PersonCard({ person, analysisCount, onClick, onDelete }: PersonCardProps) {
  const { t } = useI18n()

  return (
    <div className="bg-bg-surface rounded-card border border-border hover:border-text-tertiary transition-all duration-200 overflow-hidden group relative">
      <button
        onClick={onClick}
        className="w-full p-4 pr-14 flex items-center gap-4 text-left min-h-[44px]"
      >
        <div className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-accent/5 transition-colors">
          {person.avatar_emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-body text-text-primary font-medium truncate">{person.name}</p>
          <p className="text-caption text-text-tertiary">
            {analysisCount} {t('analyses_count')}
          </p>
        </div>
        <ChevronRight size={18} strokeWidth={1.5} className="text-text-tertiary flex-shrink-0" />
      </button>

      {onDelete && (
        <div className="absolute top-2 right-2">
          <ActionMenu
            items={[
              {
                label: t('delete_person'),
                icon: <Trash2 size={16} strokeWidth={1.5} />,
                onClick: onDelete,
                variant: 'danger',
              },
            ]}
          />
        </div>
      )}
    </div>
  )
}
