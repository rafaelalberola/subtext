'use client'

import { useState, useEffect, useCallback, ReactNode } from 'react'
import { I18nContext, detectLocale, translate, type Locale, type TranslationKey } from '@/lib/i18n'

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    setLocaleState(detectLocale())
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
  }, [])

  const t = useCallback(
    (key: TranslationKey) => translate(locale, key),
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}
