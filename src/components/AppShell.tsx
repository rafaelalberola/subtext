'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

interface SidebarContextType {
  isCollapsed: boolean
  toggleCollapsed: () => void
  mounted: boolean
  hideChrome: boolean
  setHideChrome: (v: boolean) => void
  bottomNavAction: (() => void) | null
  setBottomNavAction: (action: (() => void) | null) => void
}

const SIDEBAR_STORAGE_KEY = 'reveald_sidebar_collapsed'

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleCollapsed: () => {},
  mounted: false,
  hideChrome: false,
  setHideChrome: () => {},
  bottomNavAction: null,
  setBottomNavAction: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hideChrome, setHideChrome] = useState(false)
  const [bottomNavAction, setBottomNavAction] = useState<(() => void) | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (stored === 'true') setIsCollapsed(true)
    setMounted(true)
  }, [])

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed(prev => {
      const next = !prev
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next))
      return next
    })
  }, [])

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapsed, mounted, hideChrome, setHideChrome, bottomNavAction, setBottomNavAction }}>
      {children}
    </SidebarContext.Provider>
  )
}
