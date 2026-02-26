'use client'

import { createContext, useContext } from 'react'
import en from '@/locales/en.json'
import es from '@/locales/es.json'

export type Locale = 'en' | 'es'
export type TranslationKey = keyof typeof en

const translations: Record<Locale, Record<string, string>> = { en, es }

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const saved = localStorage.getItem('subtext_locale') as Locale | null
  if (saved === 'en' || saved === 'es') return saved
  const browserLang = navigator.language || ''
  return browserLang.startsWith('es') ? 'es' : 'en'
}

export function saveLocale(locale: Locale) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('subtext_locale', locale)
  }
}

export function translate(locale: Locale, key: TranslationKey): string {
  return translations[locale]?.[key] || translations.en[key] || key
}

// React context
interface I18nContextType {
  locale: Locale
  t: (key: TranslationKey) => string
  setLocale: (locale: Locale) => void
}

export const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  t: (key) => translations.en[key] || key,
  setLocale: () => {},
})

export function useI18n() {
  return useContext(I18nContext)
}
