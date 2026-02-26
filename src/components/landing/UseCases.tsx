'use client'

import { Heart, Briefcase, Users } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

const cases = [
  {
    icon: Heart,
    titleKey: 'use_case_dating_title',
    descKey: 'use_case_dating_desc',
    msgKey: 'use_case_dating_msg',
    revealKey: 'use_case_dating_reveal',
    color: 'text-pink-500',
    bg: 'bg-pink-50',
  },
  {
    icon: Briefcase,
    titleKey: 'use_case_work_title',
    descKey: 'use_case_work_desc',
    msgKey: 'use_case_work_msg',
    revealKey: 'use_case_work_reveal',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: Users,
    titleKey: 'use_case_friend_title',
    descKey: 'use_case_friend_desc',
    msgKey: 'use_case_friend_msg',
    revealKey: 'use_case_friend_reveal',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
] as const

export default function UseCases() {
  const { t } = useI18n()

  return (
    <section className="py-12">
      <h2 className="font-serif text-display-sm text-text-primary text-center mb-8" style={{ textWrap: 'balance' } as React.CSSProperties}>
        {t('use_cases_title')}
      </h2>
      <div className="flex flex-col gap-5">
        {cases.map((c, i) => {
          const Icon = c.icon
          return (
            <div key={i} className="bg-bg-surface rounded-card border border-border p-5">
              <div className="flex flex-col items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-full ${c.bg} flex items-center justify-center`}>
                  <Icon size={18} className={c.color} strokeWidth={1.5} />
                </div>
                <div className="text-center flex flex-col gap-1">
                  <h3 className="text-subtitle text-text-primary leading-tight">
                    {t(c.titleKey as any)}
                  </h3>
                  <p className="text-caption text-text-secondary" style={{ textWrap: 'balance' } as React.CSSProperties}>
                    {t(c.descKey as any)}
                  </p>
                </div>
              </div>

              {/* Mini bubble + reveal - connected */}
              <div className="bg-[#f1efeb] rounded-card pt-6 pr-6 pb-6 pl-4 min-h-[120px] flex items-start">
                <div className="ml-2 flex flex-col w-full">
                  {/* Bubble with tail */}
                  <div className="relative bg-white rounded-lg rounded-tl-none rounded-b-none pt-2 pr-6 pb-2 pl-4 shadow-sm bubble-tail-left">
                    <span className="text-[13px] text-[#111B21]">
                      {t(c.msgKey as any)}
                    </span>
                  </div>
                  {/* Reveal - connected directly below bubble */}
                  <div className="bubble-glass rounded-b-lg px-3 py-2 flex flex-col gap-0.5">
                    <span className="text-[11px] text-accent font-semibold uppercase tracking-wider">{t('reveal_question')}</span>
                    <p className="text-[12px] leading-[1.4] text-text-secondary">
                      {t(c.revealKey as any)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
