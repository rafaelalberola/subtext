'use client'

import { useState } from 'react'
import BottomSheet from '@/components/ui/BottomSheet'
import Button from '@/components/ui/Button'
import { useI18n } from '@/lib/i18n'

interface AddPersonFormProps {
  open: boolean
  onClose: () => void
  onSave: (name: string) => void
}

export default function AddPersonForm({ open, onClose, onSave }: AddPersonFormProps) {
  const [name, setName] = useState('')
  const { t } = useI18n()

  const handleSubmit = () => {
    if (!name.trim()) return
    onSave(name.trim())
    setName('')
  }

  const handleClose = () => {
    setName('')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={handleClose} title={t('add_person_title')}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-caption text-text-secondary">{t('person_name')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('person_name_placeholder')}
            className="w-full px-4 py-3 rounded-button bg-bg-secondary text-body text-text-primary border-2 border-transparent focus:border-accent focus:bg-white focus:outline-none transition-all"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && name.trim()) handleSubmit()
            }}
          />
        </div>

        <Button variant="primary" fullWidth onClick={handleSubmit} disabled={!name.trim()}>
          {t('save_analysis')}
        </Button>
      </div>
    </BottomSheet>
  )
}
