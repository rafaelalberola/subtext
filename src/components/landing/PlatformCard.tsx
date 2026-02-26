'use client'

import { ChevronLeft, Flame, Phone, Video } from 'lucide-react'
import AvatarCircle from '@/components/chat/AvatarCircle'
import { useI18n } from '@/lib/i18n'
import type { TranslationKey } from '@/lib/i18n'

type Platform = 'whatsapp' | 'tinder' | 'messenger'

interface PlatformCardProps {
  platform: Platform
  animationDelay?: number
}

const platformConfig = {
  whatsapp: {
    senderKey: 'carousel_wa_sender' as TranslationKey,
    msgKey: 'carousel_wa_msg' as TranslationKey,
    revealKey: 'carousel_wa_reveal' as TranslationKey,
    toneDirectKey: 'carousel_wa_tone_direct_msg' as TranslationKey,
    toneWarmKey: 'carousel_wa_tone_warm_msg' as TranslationKey,
    tonePlayfulKey: 'carousel_wa_tone_playful_msg' as TranslationKey,
    chatBg: 'bg-[#f1efeb]',
    bubbleBg: 'bg-wa-bubble-in',
    bubbleRadius: 'rounded-lg rounded-tl-none rounded-b-none',
    bubbleTail: 'bubble-tail-left',
    speakerColor: 'text-wa-green-dark',
    textColor: 'text-[#111B21]',
  },
  tinder: {
    senderKey: 'carousel_tinder_sender' as TranslationKey,
    msgKey: 'carousel_tinder_msg' as TranslationKey,
    revealKey: 'carousel_tinder_reveal' as TranslationKey,
    toneDirectKey: 'carousel_tinder_tone_direct_msg' as TranslationKey,
    toneWarmKey: 'carousel_tinder_tone_warm_msg' as TranslationKey,
    tonePlayfulKey: 'carousel_tinder_tone_playful_msg' as TranslationKey,
    chatBg: 'bg-[#f0eded]',
    bubbleBg: 'bg-white',
    bubbleRadius: 'rounded-lg rounded-tl-none rounded-b-none',
    bubbleTail: 'bubble-tail-left',
    speakerColor: 'text-tinder-pink',
    textColor: 'text-[#1a1a1a]',
  },
  messenger: {
    senderKey: 'carousel_messenger_sender' as TranslationKey,
    msgKey: 'carousel_messenger_msg' as TranslationKey,
    revealKey: 'carousel_messenger_reveal' as TranslationKey,
    toneDirectKey: 'carousel_messenger_tone_direct_msg' as TranslationKey,
    toneWarmKey: 'carousel_messenger_tone_warm_msg' as TranslationKey,
    tonePlayfulKey: 'carousel_messenger_tone_playful_msg' as TranslationKey,
    chatBg: 'bg-[#f5f5f5]',
    bubbleBg: 'bg-white',
    bubbleRadius: 'rounded-lg rounded-tl-none rounded-b-none',
    bubbleTail: 'bubble-tail-left',
    speakerColor: 'text-messenger-blue',
    textColor: 'text-[#1c1e21]',
  },
}

function WhatsAppHeader({ name }: { name: string }) {
  const { t } = useI18n()
  return (
    <div className="bg-wa-green-dark px-3 py-2.5 flex items-center gap-3 rounded-t-card">
      <ChevronLeft size={20} className="text-white/80" strokeWidth={1.5} />
      <AvatarCircle name={name} size={34} />
      <div className="flex flex-col">
        <span className="text-white text-[15px] font-medium leading-tight">{name}</span>
        <span className="text-[12px] text-white/70 leading-tight">{t('online')}</span>
      </div>
    </div>
  )
}

function TinderHeader({ name }: { name: string }) {
  return (
    <div className="bg-gradient-to-r from-tinder-pink to-tinder-orange px-3 py-2.5 flex items-center gap-3 rounded-t-card">
      <AvatarCircle name={name} size={34} />
      <div className="flex flex-col flex-1">
        <span className="text-white text-[15px] font-medium leading-tight">{name}</span>
        <span className="text-[12px] text-white/70 leading-tight">New match</span>
      </div>
      <Flame size={18} className="text-white/80" strokeWidth={1.5} />
    </div>
  )
}

function MessengerHeader({ name }: { name: string }) {
  const { t } = useI18n()
  return (
    <div className="bg-white px-3 py-2.5 flex items-center gap-3 border-b border-border rounded-t-card">
      <div className="relative">
        <AvatarCircle name={name} size={34} />
        <div className="absolute -bottom-0.5 -right-0.5 w-[10px] h-[10px] rounded-full bg-messenger-active border-2 border-white" />
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-[#1c1e21] text-[15px] font-bold leading-tight">{name}</span>
        <span className="text-[12px] text-text-secondary leading-tight">{t('carousel_messenger_status' as TranslationKey)}</span>
      </div>
      <div className="flex items-center gap-3">
        <Phone size={18} className="text-messenger-blue" strokeWidth={1.5} />
        <Video size={18} className="text-messenger-blue" strokeWidth={1.5} />
      </div>
    </div>
  )
}

export default function PlatformCard({ platform, animationDelay = 0 }: PlatformCardProps) {
  const { t } = useI18n()
  const config = platformConfig[platform]
  const senderName = t(config.senderKey)

  const tones = [
    { label: t('mockup_tone_direct'), msg: t(config.toneDirectKey), color: 'bg-blue-100 text-blue-700' },
    { label: t('mockup_tone_warm'), msg: t(config.toneWarmKey), color: 'bg-pink-100 text-pink-700' },
    { label: t('mockup_tone_playful'), msg: t(config.tonePlayfulKey), color: 'bg-purple-100 text-purple-700' },
  ]

  const Header = platform === 'whatsapp'
    ? WhatsAppHeader
    : platform === 'tinder'
    ? TinderHeader
    : MessengerHeader

  return (
    <div
      className="rounded-card overflow-hidden bg-white border border-[#d6d1ca] opacity-0 animate-fade-in-up w-full flex flex-col"
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: 'forwards' }}
    >
      <Header name={senderName} />

      <div className={`p-3 flex flex-col gap-3 flex-1 ${config.chatBg}`}>
        {/* Incoming message */}
        <div className="flex justify-start">
          <div className="w-full ml-2 flex flex-col">
            <span className={`text-[11px] font-medium ${config.speakerColor} mb-0.5`}>
              {senderName}
            </span>

            {/* Bubble */}
            <div className={`relative pt-2 pr-6 pb-2 pl-4 shadow-sm ${config.bubbleBg} ${config.bubbleRadius} ${config.bubbleTail}`}>
              <span className={`text-[14.5px] leading-[19px] ${config.textColor}`}>
                {t(config.msgKey)}
              </span>
            </div>

            {/* Reveald reveal */}
            <div
              className="bubble-glass rounded-b-lg px-3.5 py-2.5 flex flex-col gap-0.5 opacity-0 animate-reveal-in"
              style={{ animationDelay: `${animationDelay + 600}ms`, animationFillMode: 'forwards' }}
            >
              <span className="text-[11px] text-accent font-semibold uppercase tracking-wider">
                {t('reveal_question')}
              </span>
              <p className="text-[13px] leading-[1.4] text-text-secondary">
                {t(config.revealKey)}
              </p>
            </div>
          </div>
        </div>

        {/* Tone suggestions */}
        <div
          className="bubble-glass rounded-card px-3.5 py-2.5 ml-2 flex flex-col gap-2 opacity-0 animate-reveal-in"
          style={{ animationDelay: `${animationDelay + 900}ms`, animationFillMode: 'forwards' }}
        >
          <span className="text-[11px] text-accent font-semibold uppercase tracking-wider">
            {t('mockup_respond_label')}
          </span>
          <div className="flex flex-col gap-2">
            {tones.map((tone, j) => (
              <div key={j} className="flex flex-col gap-1 bg-white rounded-lg px-3 py-2.5 border border-border/60">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${tone.color} self-start`}>
                  {tone.label}
                </span>
                <p className="text-[12px] leading-[1.4] text-text-secondary">
                  {tone.msg}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
