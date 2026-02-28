'use client'

import { useState, useEffect } from 'react'
import { useSidebar } from '@/components/AppShell'
import { createClient } from '@/lib/supabase/client'

export default function AppContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed, mounted } = useSidebar()
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setIsAuthed(!!user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session?.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  const showSidebarPadding = isAuthed === true

  return (
    <div
      className={`
        flex flex-col min-h-screen bg-bg-primary ${isAuthed ? 'pb-44 md:pb-8' : 'pb-8'}
        ${mounted ? 'transition-[padding-left] duration-200 ease-out' : ''}
        ${showSidebarPadding ? (isCollapsed ? 'md:pl-16' : 'md:pl-64') : ''}
      `}
    >
      <main className="flex-1 flex flex-col px-section pt-4">
        {children}
      </main>
    </div>
  )
}
