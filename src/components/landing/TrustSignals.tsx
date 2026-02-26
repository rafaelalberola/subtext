'use client'

import { Shield } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export default function TrustSignals() {
  const { t } = useI18n()

  return (
    <section className="py-8">
      <div className="flex justify-center">
        <div className="inline-flex flex-col items-center gap-3 px-5 py-3 rounded-card bg-bg-surface border border-border text-center">
          <Shield size={16} strokeWidth={1.5} className="text-success flex-shrink-0" />
          <p className="text-caption text-text-secondary">
            {t('settings_privacy_note')}
          </p>
        </div>
      </div>
    </section>
  )
}
