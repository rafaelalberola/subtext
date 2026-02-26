'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import type { PlanId } from '@/types/subscription'
import type { TranslationKey } from '@/lib/i18n'

interface PlanBadgeProps {
  plan: PlanId
}

const badgeStyles: Record<PlanId, string> = {
  free: 'bg-bg-secondary text-text-tertiary',
  plus: 'bg-info/10 text-info',
  pro: 'bg-purple-100 text-purple-600',
}

const badgeLabelKeys: Record<PlanId, TranslationKey> = {
  free: 'plan_free',
  plus: 'plan_plus',
  pro: 'plan_pro',
}

export default function PlanBadge({ plan }: PlanBadgeProps) {
  const { t } = useI18n()

  return (
    <Link href="/app/pricing">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-pill text-[11px] font-semibold transition-opacity hover:opacity-80 ${badgeStyles[plan]}`}
      >
        {t(badgeLabelKeys[plan])}
      </span>
    </Link>
  )
}
