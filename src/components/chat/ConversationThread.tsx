'use client'

import { DecodedPair } from '@/types/analysis'
import MessageBlock from './MessageBlock'
import SubtextReveal from './SubtextReveal'

interface ConversationThreadProps {
  pairs: DecodedPair[]
  showReveals?: boolean
  animated?: boolean
  contactName?: string
}

const UNKNOWN_VARIANTS = ['unknown', 'persona desconocida', 'desconocido', 'unknown person']

export default function ConversationThread({
  pairs,
  showReveals = true,
  animated = false,
  contactName,
}: ConversationThreadProps) {
  const resolveSpeaker = (speaker?: string) => {
    if (!speaker) return contactName
    if (contactName && UNKNOWN_VARIANTS.includes(speaker.toLowerCase())) return contactName
    return speaker
  }

  return (
    <div className="flex flex-col gap-5">

      {pairs.map((pair, i) => {
        const bubbleDelay = animated ? 100 + i * 150 : 0
        const revealDelay = animated ? bubbleDelay + 300 : 0

        return (
          <div key={i} className="flex flex-col">
            <MessageBlock
              text={pair.said}
              speaker={resolveSpeaker(pair.speaker)}
              animated={animated}
              delay={bubbleDelay}
            />
            <SubtextReveal
              meant={pair.meant}
              side="left"
              visible={showReveals}
              animated={animated}
              delay={revealDelay}
            />
          </div>
        )
      })}
    </div>
  )
}
