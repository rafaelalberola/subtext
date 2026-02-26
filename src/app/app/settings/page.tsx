'use client'

import { useState, useEffect } from 'react'
import { LogOut, LogIn, Trash2, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n'
import LanguageToggle from '@/components/LanguageToggle'
import AuthPrompt from '@/components/AuthPrompt'
import Button from '@/components/ui/Button'
import SectionGroup from '@/components/ui/SectionGroup'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import type { User } from '@supabase/supabase-js'

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { locale, setLocale, t } = useI18n()

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) setShowAuth(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const handleDeleteData = async () => {
    if (!user) return
    await supabase.from('analyses').delete().eq('user_id', user.id)
    await supabase.from('user_preferences').delete().eq('user_id', user.id)
    setShowDeleteConfirm(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-title text-text-primary">{t('settings_title')}</h1>

      {/* Language */}
      <SectionGroup title={t('settings_language')}>
        <div className="bg-white rounded-input p-4 border border-border">
          <LanguageToggle locale={locale} onChange={setLocale} />
        </div>
        <p className="text-caption text-text-tertiary">
          {locale === 'es'
            ? 'El idioma del análisis se determina por la conversación, no por este ajuste.'
            : 'Analysis language is determined by the input conversation, not this setting.'}
        </p>
      </SectionGroup>

      {/* Account */}
      <SectionGroup title={t('settings_account')}>
        {loading ? (
          <div className="h-14 bg-white rounded-input animate-shimmer shimmer" />
        ) : user ? (
          <div className="space-y-3">
            <div className="bg-white rounded-input p-4 border border-border">
              <p className="text-caption text-text-tertiary">{t('settings_signed_in_as')}</p>
              <p className="text-body text-text-primary font-medium mt-0.5">
                {user.email}
              </p>
            </div>
            <Button variant="ghost" fullWidth onClick={handleSignOut}>
              <LogOut size={16} strokeWidth={1.5} />
              {t('settings_sign_out')}
            </Button>
          </div>
        ) : showAuth ? (
          <AuthPrompt />
        ) : (
          <Button variant="secondary" fullWidth onClick={() => setShowAuth(true)}>
            <LogIn size={16} strokeWidth={1.5} />
            {t('settings_sign_in')}
          </Button>
        )}
      </SectionGroup>

      {/* Privacy */}
      <SectionGroup title={t('settings_privacy')}>
        <div className="flex items-start gap-3 p-4 bg-white rounded-card border border-border">
          <Shield size={18} strokeWidth={1.5} className="text-success mt-0.5 flex-shrink-0" />
          <p className="text-body text-text-secondary">
            {t('settings_privacy_note')}
          </p>
        </div>
        {user && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-body text-text-tertiary hover:text-danger transition-colors min-h-[44px]"
          >
            <Trash2 size={16} strokeWidth={1.5} />
            {t('settings_delete_data')}
          </button>
        )}
      </SectionGroup>

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteData}
        title={t('confirm_delete_data_title')}
        description={t('confirm_delete_data_desc')}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        variant="danger"
      />
    </div>
  )
}
