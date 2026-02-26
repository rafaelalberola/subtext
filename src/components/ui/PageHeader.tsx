'use client'

import { ArrowLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  avatar?: string
  onBack?: () => void
}

export default function PageHeader({ title, subtitle, avatar, onBack }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3 pb-4 mb-5 border-b border-border -mx-[24px] px-[24px]">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-[16px] border border-border text-text-secondary hover:text-text-primary transition-colors flex-shrink-0"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
        </button>
      )}
      {avatar && (
        <div className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-xl flex-shrink-0">
          {avatar}
        </div>
      )}
      <div className="flex flex-col gap-0 flex-1">
        <h1 className="text-title text-text-primary">{title}</h1>
        {subtitle && (
          <p className="text-caption text-text-tertiary">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
