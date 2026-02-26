'use client'

import { useI18n } from '@/lib/i18n'

interface SubtextRevealProps {
  meant: string
  side: 'left' | 'right'
  visible?: boolean
  animated?: boolean
  delay?: number
}

export default function SubtextReveal({
  meant,
  side,
  visible = true,
  animated = false,
  delay = 0,
}: SubtextRevealProps) {
  const { t } = useI18n()

  if (!visible) return null

  return (
    <div
      className={`bubble-glass rounded-b-lg px-3.5 py-2.5 flex flex-col gap-0.5 ${animated ? 'opacity-0 animate-reveal-in' : ''}`}
      style={animated ? { animationDelay: `${delay}ms`, animationFillMode: 'forwards' } : undefined}
    >
      <span className="text-[11px] text-accent font-semibold uppercase tracking-wider">
        {t('reveal_question')}
      </span>
      <p className="text-[13px] leading-[1.4] text-text-secondary">
        {meant}
      </p>
    </div>
  )
}
