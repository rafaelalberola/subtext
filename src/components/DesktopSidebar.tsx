'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Settings, PanelLeftClose, PanelLeft } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { useSidebar } from '@/components/AppShell'
import type { TranslationKey } from '@/lib/i18n'
import type { SavedAnalysis, Person } from '@/types/analysis'

const navItems: Array<{ href: string; labelKey: TranslationKey; icon: typeof Home }> = [
  { href: '/app', labelKey: 'nav_analyze', icon: Home },
  { href: '/app/people', labelKey: 'nav_people', icon: Users },
  { href: '/app/settings', labelKey: 'nav_settings', icon: Settings },
]

const HIDDEN_PATHS = ['/app/pricing']

function getRelativeDate(dateStr: string, t: (key: TranslationKey) => string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return t('time_ago_just_now')
  if (diffHours < 24) return `${diffHours}${t('time_ago_hours')}`
  if (diffDays < 30) return `${diffDays}${t('time_ago_days')}`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function DesktopSidebar() {
  const pathname = usePathname()
  const { t } = useI18n()
  const { isCollapsed, toggleCollapsed, mounted } = useSidebar()

  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([])
  const [personsMap, setPersonsMap] = useState<Record<string, Person>>({})
  const [historyLoading, setHistoryLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const fetchHistory = async () => {
      setHistoryLoading(true)
      const [analysesRes, personsRes] = await Promise.all([
        supabase
          .from('analyses')
          .select('id, input_text, contact_label, person_id, created_at, analysis_json')
          .order('created_at', { ascending: false })
          .limit(30),
        supabase
          .from('people')
          .select('id, name'),
      ])
      setAnalyses((analysesRes.data as SavedAnalysis[]) || [])
      const map: Record<string, Person> = {}
      for (const p of (personsRes.data || []) as Person[]) {
        map[p.id] = p
      }
      setPersonsMap(map)
      setHistoryLoading(false)
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthed(!!user)
      if (user) fetchHistory()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session?.user)
      if (session?.user) fetchHistory()
    })

    return () => subscription.unsubscribe()
  }, [pathname])

  if (HIDDEN_PATHS.includes(pathname)) return null
  if (!isAuthed) return null

  return (
    <aside
      className={`
        hidden md:flex flex-col
        fixed left-0 top-0 h-screen
        bg-white border-r border-border
        z-40 overflow-hidden
        ${mounted ? 'transition-[width] duration-200 ease-out' : ''}
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Logo + collapse toggle */}
      <div className="flex items-center justify-between px-4 h-14 flex-shrink-0 border-b border-border">
        {!isCollapsed ? (
          <span className="font-serif text-subtitle font-semibold text-text-primary truncate">
            Reveald
          </span>
        ) : (
          <span className="font-serif text-subtitle font-semibold text-text-primary">
            R
          </span>
        )}
        <button
          onClick={toggleCollapsed}
          className="p-1.5 rounded-card text-text-tertiary hover:text-text-primary hover:bg-bg-secondary transition-colors"
          title={isCollapsed ? t('sidebar_expand') : t('sidebar_collapse')}
        >
          {isCollapsed
            ? <PanelLeft size={18} strokeWidth={1.5} />
            : <PanelLeftClose size={18} strokeWidth={1.5} />
          }
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-2 py-3">
        {navItems.map(({ href, labelKey, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-card transition-colors
                ${isCollapsed ? 'justify-center' : ''}
                ${isActive
                  ? 'text-text-primary bg-bg-secondary'
                  : 'text-text-tertiary hover:text-text-primary hover:bg-bg-secondary'
                }
              `}
              title={isCollapsed ? t(labelKey) : undefined}
            >
              <Icon size={20} strokeWidth={1.5} className="flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-body font-medium truncate">{t(labelKey)}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* History (only when expanded) */}
      {!isCollapsed && (
        <>
          <div className="px-4 py-2 border-t border-border">
            <span className="text-caption font-medium text-text-tertiary uppercase tracking-wider">
              {t('history_title')}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {historyLoading && (
              <div className="flex flex-col">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex flex-col gap-1.5 px-4 py-3 border-b border-border/50">
                    <div className="h-2.5 bg-bg-secondary rounded animate-pulse w-20" />
                    <div className="h-3 bg-bg-secondary rounded animate-pulse w-full" />
                    <div className="h-2 bg-bg-secondary rounded animate-pulse w-12" />
                  </div>
                ))}
              </div>
            )}

            {!historyLoading && analyses.length === 0 && (
              <div className="px-4 py-6 text-center">
                <p className="text-caption text-text-tertiary">{t('history_empty_title')}</p>
              </div>
            )}

            {!historyLoading && analyses.map(item => {
              const person = item.person_id ? personsMap[item.person_id] : null
              return (
                <Link
                  key={item.id}
                  href={`/app/analysis/${item.id}`}
                  className={`
                    flex flex-col gap-0.5 px-4 py-3 border-b border-border/50
                    hover:bg-bg-secondary transition-colors
                    ${pathname === `/app/analysis/${item.id}` ? 'bg-bg-secondary' : ''}
                  `}
                >
                  <p className="text-[11px] font-medium text-text-tertiary truncate">
                    {person?.name || item.contact_label || t('anyone')}
                  </p>
                  <p className="text-caption text-text-primary truncate leading-tight">
                    {item.input_text?.slice(0, 60)}
                  </p>
                  <p className="text-[11px] text-text-tertiary">
                    {getRelativeDate(item.created_at, t)}
                  </p>
                </Link>
              )
            })}
          </div>
        </>
      )}

    </aside>
  )
}
