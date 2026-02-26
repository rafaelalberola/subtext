'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { UsageInfo } from '@/types/subscription'

interface SubscriptionContextType {
  usage: UsageInfo | null
  loading: boolean
  refreshUsage: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  usage: null,
  loading: true,
  refreshUsage: async () => {},
})

export function useSubscription() {
  return useContext(SubscriptionContext)
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [usage, setUsage] = useState<UsageInfo | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUsage = useCallback(async () => {
    try {
      const res = await fetch('/api/usage')
      if (res.ok) {
        const data = await res.json()
        setUsage(data)
      } else {
        // Not authenticated or error — set null
        setUsage(null)
      }
    } catch {
      setUsage(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUsage()
  }, [refreshUsage])

  return (
    <SubscriptionContext.Provider value={{ usage, loading, refreshUsage }}>
      {children}
    </SubscriptionContext.Provider>
  )
}
