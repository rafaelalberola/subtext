'use client'

import ChatHeader from './ChatHeader'
import { useI18n } from '@/lib/i18n'

export default function ConversationMockup() {
  const { t } = useI18n()

  const messages = [
    {
      text: t('mockup_msg_1'),
      side: 'left' as const,
      timestamp: '10:42 AM',
      speaker: 'Alex',
      type: 'reveal' as const,
      meant: t('mockup_reveal_1'),
      bubbleDelay: 400,
      revealDelay: 1100,
    },
    {
      text: t('mockup_msg_2'),
      side: 'right' as const,
      timestamp: '10:43 AM',
      type: 'tones' as const,
      bubbleDelay: 600,
      revealDelay: 1300,
    },
    {
      text: t('mockup_msg_3'),
      side: 'left' as const,
      timestamp: '10:44 AM',
      speaker: 'Alex',
      type: 'reveal' as const,
      meant: t('mockup_reveal_3'),
      bubbleDelay: 800,
      revealDelay: 1500,
    },
  ]

  const tones = [
    { label: t('mockup_tone_direct'), msg: t('mockup_tone_direct_msg'), color: 'bg-blue-100 text-blue-700' },
    { label: t('mockup_tone_warm'), msg: t('mockup_tone_warm_msg'), color: 'bg-pink-100 text-pink-700' },
    { label: t('mockup_tone_playful'), msg: t('mockup_tone_playful_msg'), color: 'bg-purple-100 text-purple-700' },
  ]

  return (
    <div className="rounded-card overflow-hidden bg-white border border-[#d6d1ca]">
      <ChatHeader name="Alex" online />

      <div className="p-3 flex flex-col gap-3 min-h-[280px] bg-[#f1efeb]">
        {messages.map((msg, i) => {
          const isLeft = msg.side === 'left'
          const isFirst = i === 0 || messages[i - 1].side !== msg.side

          return (
            <div key={i} className="flex flex-col gap-0">
              <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-full flex flex-col ${isLeft ? 'ml-2' : 'mr-2'}`}>
                  {/* Speaker name */}
                  {isFirst && isLeft && msg.speaker && (
                    <span className="text-[11px] font-medium text-wa-green-dark mb-0.5">
                      {msg.speaker}
                    </span>
                  )}

                  {/* Bubble */}
                  <div
                    className={`relative pt-2 pr-6 pb-2 pl-4 shadow-sm opacity-0 animate-fade-in-up ${
                      isLeft
                        ? 'bg-wa-bubble-in rounded-lg rounded-tl-none bubble-tail-left'
                        : 'bg-wa-bubble-out rounded-lg rounded-tr-none bubble-tail-right'
                    }`}
                    style={{ animationDelay: `${msg.bubbleDelay}ms`, animationFillMode: 'forwards' }}
                  >
                    <span className="text-[14.5px] leading-[19px] text-[#111B21]">
                      {msg.text}
                    </span>
                    <span className="float-right mt-1 ml-2 text-[11px] text-wa-time leading-none">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Reveal section - connected to bubble */}
                  {msg.type === 'reveal' && msg.meant && (
                    <div
                      className="bubble-glass rounded-b-lg px-3.5 py-2.5 flex flex-col gap-0.5 opacity-0 animate-reveal-in"
                      style={{ animationDelay: `${msg.revealDelay}ms`, animationFillMode: 'forwards' }}
                    >
                      <span className="text-[11px] text-accent font-semibold uppercase tracking-wider">
                        {t('reveal_question')}
                      </span>
                      <p className="text-[13px] leading-[1.4] text-text-secondary">
                        {msg.meant}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tones section - full width */}
              {msg.type === 'tones' && (
                <div
                  className="bubble-glass rounded-lg px-3.5 py-2.5 flex flex-col gap-2 opacity-0 animate-reveal-in mt-1"
                  style={{ animationDelay: `${msg.revealDelay}ms`, animationFillMode: 'forwards' }}
                >
                  <span className="text-[11px] text-accent font-semibold uppercase tracking-wider">
                    {t('mockup_respond_label')}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {tones.map((tone, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${tone.color} flex-shrink-0 mt-0.5`}>
                          {tone.label}
                        </span>
                        <p className="text-[12px] leading-[1.3] text-text-secondary">
                          {tone.msg}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
