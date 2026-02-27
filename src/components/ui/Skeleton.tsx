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
  return (
    <div className="flex flex-col gap-card-gap">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 h-14 -mt-4">
        <Skeleton className="w-10 h-10 rounded-[16px]" />
        <Skeleton className="h-5 w-48" />
      </div>
      {/* Person banner skeleton */}
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-card-gap">
        <div className="flex items-center gap-3 p-3 rounded-card border border-border">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        {/* Date separator */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <Skeleton className="h-3 w-36" />
          <div className="flex-1 h-px bg-border" />
        </div>
        {/* Conversation skeleton */}
        <div className="rounded-card bg-[#f1efeb] p-3 flex flex-col gap-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-12 w-full" />
        </div>
        {/* Overall read skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}

export function ThinkingIndicator() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col items-center justify-center gap-6" style={{ minHeight: 'calc(100vh - 280px)' }}>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-accent/60 animate-thinking-dot" style={{ animationDelay: '0ms' }} />
        <span className="w-3 h-3 rounded-full bg-accent/60 animate-thinking-dot" style={{ animationDelay: '160ms' }} />
        <span className="w-3 h-3 rounded-full bg-accent/60 animate-thinking-dot" style={{ animationDelay: '320ms' }} />
      </div>
      <p className="text-caption text-text-tertiary">{t('thinking_label')}</p>
    </div>
  )
}
