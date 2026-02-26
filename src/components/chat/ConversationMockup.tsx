'use client'

import ChatHeader from './ChatHeader'
import ChatBubble from './ChatBubble'
import SubtextReveal from './SubtextReveal'
import { useI18n } from '@/lib/i18n'

export default function ConversationMockup() {
  const { t } = useI18n()

  const messages = [
    {
      text: t('mockup_msg_1'),
      side: 'left' as const,
      timestamp: '10:42 AM',
      speaker: 'Alex',
      meant: t('mockup_reveal_1'),
      confidence: 'likely' as const,
    },
    {
      text: t('mockup_msg_2'),
      side: 'right' as const,
      timestamp: '10:43 AM',
      readReceipt: 'read' as const,
      meant: t('mockup_reveal_2'),
      confidence: 'very_likely' as const,
    },
    {
      text: t('mockup_msg_3'),
      side: 'left' as const,
      timestamp: '10:44 AM',
      speaker: 'Alex',
      meant: t('mockup_reveal_3'),
      confidence: 'very_likely' as const,
    },
  ]

  return (
    <div className="max-w-sm mx-auto rounded-[12px] shadow-xl overflow-hidden bg-white">
      <ChatHeader name="Alex" online />

      <div className="p-3 space-y-3 min-h-[280px] bg-bg-secondary">
        {messages.map((msg, i) => {
          const showTail = i === 0 || messages[i - 1].side !== msg.side
          const bubbleDelay = 400 + i * 200
          const revealDelay = 1100 + i * 200

          return (
            <div key={i} className="space-y-1.5">
              <ChatBubble
                text={msg.text}
                side={msg.side}
                timestamp={msg.timestamp}
                showTail={showTail}
                readReceipt={msg.side === 'right' ? msg.readReceipt : undefined}
                speaker={showTail && msg.side === 'left' ? msg.speaker : undefined}
                animated
                delay={bubbleDelay}
              />
              <SubtextReveal
                meant={msg.meant}
                confidence={msg.confidence}
                side={msg.side}
                visible
                animated
                delay={revealDelay}
                showConfidence={false}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
