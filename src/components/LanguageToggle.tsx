'use client'

import { Locale } from '@/lib/i18n'

interface LanguageToggleProps {
  locale: Locale
  onChange: (locale: Locale) => void
}

export default function LanguageToggle({ locale, onChange }: LanguageToggleProps) {
  return (
    <div className="flex bg-bg-secondary rounded-input p-1">
      <button
        onClick={() => onChange('en')}
        className={`
          flex-1 py-2.5 rounded-lg text-body font-medium transition-all duration-200
          ${locale === 'en'
            ? 'bg-white text-text-primary border border-border'
            : 'text-text-tertiary hover:text-text-secondary'
          }
        `}
      >
        English
      </button>
      <button
        onClick={() => onChange('es')}
        className={`
          flex-1 py-2.5 rounded-lg text-body font-medium transition-all duration-200
          ${locale === 'es'
            ? 'bg-white text-text-primary border border-border'
            : 'text-text-tertiary hover:text-text-secondary'
          }
        `}
      >
        Español
      </button>
    </div>
  )
}
