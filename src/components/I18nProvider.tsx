'use client'

import { useState, useEffect, useCallback, ReactNode } from 'react'
import { I18nContext, detectLocale, translate, type Locale, type TranslationKey } from '@/lib/i18n'

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale | null>(null)

  useEffect(() => {
    setLocaleState(detectLocale())
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
  }, [])

  const resolvedLocale = locale ?? 'en'

  const t = useCallback(
    (key: TranslationKey) => translate(resolvedLocale, key),
    [resolvedLocale]
  )

  // Don't render until locale is detected to avoid language flicker
  if (!locale) return null

  return (
    <I18nContext.Provider value={{ locale: resolvedLocale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}
