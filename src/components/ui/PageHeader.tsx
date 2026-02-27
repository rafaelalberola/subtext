'use client'

import { ArrowLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  avatar?: string
  onBack?: () => void
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, avatar, onBack, action }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-30 bg-bg-primary flex items-center gap-3 h-14 border-b border-border -mx-section px-section -mt-4">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 rounded-[12px] border border-border text-text-secondary hover:text-text-primary transition-colors flex-shrink-0"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
      )}
      {avatar && (
        <div className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-base flex-shrink-0">
          {avatar}
        </div>
      )}
      <div className="flex flex-col gap-0 flex-1 min-w-0">
        <h1 className="text-subtitle text-text-primary truncate">{title}</h1>
        {subtitle && (
          <p className="text-caption text-text-tertiary">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
