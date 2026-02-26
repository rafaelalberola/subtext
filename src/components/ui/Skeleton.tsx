'use client'

import { useI18n } from '@/lib/i18n'

interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`rounded-card bg-bg-secondary shimmer animate-shimmer ${className}`}
      aria-hidden="true"
    />
  )
}

export function AnalysisSkeleton() {
  return <ThinkingIndicator />
}

export function ThinkingIndicator() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-accent/60 animate-thinking-dot" style={{ animationDelay: '0ms' }} />
        <span className="w-3 h-3 rounded-full bg-accent/60 animate-thinking-dot" style={{ animationDelay: '160ms' }} />
        <span className="w-3 h-3 rounded-full bg-accent/60 animate-thinking-dot" style={{ animationDelay: '320ms' }} />
      </div>
      <p className="text-caption text-text-tertiary">{t('thinking_label')}</p>
    </div>
  )
}
