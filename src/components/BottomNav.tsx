'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Settings, Plus } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { useSidebar } from '@/components/AppShell'
import type { TranslationKey } from '@/lib/i18n'

const navItems: Array<{ href: string; labelKey: TranslationKey; icon: typeof Home }> = [
  { href: '/app', labelKey: 'nav_analyze', icon: Home },
  { href: '/app/people', labelKey: 'nav_people', icon: Users },
  { href: '/app/settings', labelKey: 'nav_settings', icon: Settings },
]

const HIDDEN_PATHS = ['/app/pricing']

export default function BottomNav() {
  const pathname = usePathname()
  const { t } = useI18n()
  const { hideChrome, bottomNavAction } = useSidebar()
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)
  const showPlus = pathname === '/app/people' && bottomNavAction !== null

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthed(!!user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session?.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (HIDDEN_PATHS.includes(pathname) || pathname.startsWith('/app/analysis/')) return null
  if (!isAuthed) return null
  if (hideChrome) return null

  return (
    <nav className="fixed bottom-4 left-4 right-4 safe-bottom z-40 [touch-action:manipulation] md:hidden">
      <div className="flex items-center justify-center gap-4 transition-all duration-300">
        <div className="flex items-center justify-around h-14 rounded-pill bubble-glass border border-white/40 shadow-lg"
          style={{ width: 250 }}
        >
          {navItems.map(({ href, labelKey, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex flex-col items-center justify-center gap-0.5
                  min-h-[44px] min-w-[44px] px-4 py-2
                  transition-colors duration-200 [touch-action:manipulation]
                  ${isActive ? 'text-accent' : 'text-text-tertiary'}
                `}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span className="text-[10px] font-medium">{t(labelKey)}</span>
              </Link>
            )
          })}
        </div>

        {showPlus && (
          <button
            key="plus-btn"
            onClick={() => bottomNavAction?.()}
            className="w-14 h-14 rounded-full bubble-glass-dark border border-white/10 shadow-lg flex items-center justify-center text-white animate-bounce-in"
            style={{ willChange: 'transform, opacity' }}
          >
            <Plus size={24} strokeWidth={2} />
          </button>
        )}
      </div>
    </nav>
  )
}
