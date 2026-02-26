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
      <h2 className="font-serif text-display-sm text-text-primary text-center mb-8">
        {t('use_cases_title')}
      </h2>
      <div className="space-y-5">
        {cases.map((c, i) => {
          const Icon = c.icon
          return (
            <div key={i} className="bg-bg-surface rounded-card border border-border p-5">
              <div className="flex flex-col items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-full ${c.bg} flex items-center justify-center`}>
                  <Icon size={18} className={c.color} strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <h3 className="text-subtitle text-text-primary leading-tight">
                    {t(c.titleKey as any)}
                  </h3>
                  <p className="text-caption text-text-secondary">
                    {t(c.descKey as any)}
                  </p>
                </div>
              </div>

              {/* Mini bubble + reveal */}
              <div className="bg-wa-bg rounded-lg p-3">
                <div className="bg-white rounded-lg px-3 py-2 shadow-sm max-w-[85%]">
                  <span className="text-[13px] text-[#111B21]">
                    {t(c.msgKey as any)}
                  </span>
                </div>
                <div className="ml-3 mt-1.5 pl-2.5 border-l-2 border-accent">
                  <span className="text-[11px] text-accent font-medium uppercase tracking-wide">Subtext</span>
                  <p className="text-[12px] leading-[1.4] text-text-primary mt-0.5">
                    {t(c.revealKey as any)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
