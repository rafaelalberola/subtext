'use client'

import { ConfidencePill } from '@/components/ui/Pill'

interface SubtextRevealProps {
  meant: string
  confidence: 'very_likely' | 'likely' | 'possible'
  side: 'left' | 'right'
  visible?: boolean
  animated?: boolean
  delay?: number
  showConfidence?: boolean
}

export default function SubtextReveal({
  meant,
  confidence,
  side,
  visible = true,
  animated = false,
  delay = 0,
  showConfidence = true,
}: SubtextRevealProps) {
  if (!visible) return null

  const isLeft = side === 'left'

  return (
    <div
      className={`flex ${isLeft ? 'justify-start' : 'justify-end'} ${animated ? 'opacity-0 animate-reveal-in' : ''}`}
      style={animated ? { animationDelay: `${delay}ms`, animationFillMode: 'forwards' } : undefined}
    >
      <div
        className={`max-w-[80%] py-1.5 ${
          isLeft ? 'ml-4 pl-3 border-l-2 border-accent' : 'mr-4 pr-3 border-r-2 border-accent text-right'
        }`}
      >
        <span className="text-[11px] text-accent font-medium uppercase tracking-wide">
          Subtext
        </span>
        <p className="text-[13px] leading-[1.4] text-text-primary mt-0.5">
          {meant}
        </p>
        {showConfidence && (
          <div className={`mt-1 ${isLeft ? '' : 'flex justify-end'}`}>
            <ConfidencePill confidence={confidence} />
          </div>
        )}
      </div>
    </div>
  )
}
