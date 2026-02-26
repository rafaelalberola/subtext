'use client'

import { DecodedPair } from '@/types/analysis'
import ChatBubble from './ChatBubble'
import SubtextReveal from './SubtextReveal'
import { classifySpeakers, groupConsecutiveSpeakers } from './utils'

interface ConversationThreadProps {
  pairs: DecodedPair[]
  showReveals?: boolean
  animated?: boolean
}

export default function ConversationThread({
  pairs,
  showReveals = true,
  animated = false,
}: ConversationThreadProps) {
  const speakerMap = classifySpeakers(pairs)
  const isFirstInGroup = groupConsecutiveSpeakers(pairs)

  return (
    <div className="bg-wa-bg rounded-card p-4 space-y-3">
      {pairs.map((pair, i) => {
        const side = pair.speaker ? (speakerMap.get(pair.speaker) ?? 'left') : 'left'
        const showTail = isFirstInGroup[i]
        const bubbleDelay = animated ? 100 + i * 150 : 0
        const revealDelay = animated ? bubbleDelay + 300 : 0

        return (
          <div key={i} className="space-y-1.5">
            <ChatBubble
              text={pair.said}
              side={side}
              showTail={showTail}
              speaker={pair.speaker}
              animated={animated}
              delay={bubbleDelay}
            />
            <SubtextReveal
              meant={pair.meant}
              confidence={pair.confidence}
              side={side}
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
