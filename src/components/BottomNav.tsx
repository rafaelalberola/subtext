'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Settings } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import type { TranslationKey } from '@/lib/i18n'

const navItems: Array<{ href: string; labelKey: TranslationKey; icon: typeof Home }> = [
  { href: '/app', labelKey: 'nav_analyze', icon: Home },
  { href: '/app/people', labelKey: 'nav_people', icon: Users },
  { href: '/app/settings', labelKey: 'nav_settings', icon: Settings },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { t } = useI18n()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border safe-bottom z-40">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16">
        {navItems.map(({ href, labelKey, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex flex-col items-center justify-center gap-1
                min-h-[44px] min-w-[44px] px-4 py-2
                transition-colors duration-200
                ${isActive ? 'text-accent' : 'text-text-tertiary'}
              `}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-[11px] font-medium">{t(labelKey)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
