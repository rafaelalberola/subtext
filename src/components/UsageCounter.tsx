'use client'

import { useI18n } from '@/lib/i18n'
import Link from 'next/link'
import { Zap } from 'lucide-react'

interface UsageCounterProps {
  used: number
  limit: number
  bonusCredits: number
}

export default function UsageCounter({ used, limit, bonusCredits }: UsageCounterProps) {
  const { t } = useI18n()

  const total = limit + bonusCredits
  const remaining = Math.max(0, total - used)
  const percentage = total > 0 ? Math.min(1, used / total) : 1

  // Color based on remaining percentage
  const remainingPct = 1 - percentage
  const color = remainingPct > 0.5 ? '#00A699' : remainingPct > 0.25 ? '#F59E0B' : '#EF4444'

  const radius = 20
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * percentage

  if (remaining <= 0) {
    return (
      <Link
        href="/app/pricing"
        className="flex items-center gap-2 px-3 py-1.5 bg-danger/10 text-danger rounded-pill text-caption font-medium transition-colors hover:bg-danger/20"
      >
        {t('upgrade')}
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 48 48">
          {/* Background ring */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="#E8E8E8"
            strokeWidth="3"
          />
          {/* Progress ring */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold"
          style={{ color }}
        >
          {remaining}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] text-text-tertiary leading-tight">
          {t('usage_left')}
        </span>
        {used >= limit && bonusCredits > 0 && (
          <span className="flex items-center gap-0.5 text-[10px] text-warning leading-tight">
            <Zap size={10} strokeWidth={2} />
            {t('usage_credits')}
          </span>
        )}
      </div>
    </div>
  )
}
