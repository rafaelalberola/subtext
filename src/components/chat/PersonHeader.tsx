'use client'

import { useI18n } from '@/lib/i18n'
import type { Person } from '@/types/analysis'

interface PersonHeaderProps {
  person: Person
  onChangePress: () => void
}

export default function PersonHeader({ person, onChangePress }: PersonHeaderProps) {
  const { t } = useI18n()

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-bg-surface border border-border rounded-card">
      <div className="w-9 h-9 rounded-full bg-bg-secondary flex items-center justify-center text-subtitle">
        {person.avatar_emoji}
      </div>
      <span className="text-subtitle text-text-primary flex-1">
        {person.name}
      </span>
      <button
        onClick={onChangePress}
        className="text-caption text-text-tertiary hover:text-accent transition-colors min-h-[44px] px-2"
      >
        {t('change_person')}
      </button>
    </div>
  )
}
