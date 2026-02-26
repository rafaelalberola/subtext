'use client'

import { useI18n } from '@/lib/i18n'

interface XRayToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export default function XRayToggle({ enabled, onChange }: XRayToggleProps) {
  const { t } = useI18n()

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-caption text-text-secondary font-medium">
        {t('xray_toggle')}
      </span>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
          enabled ? 'bg-accent' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
