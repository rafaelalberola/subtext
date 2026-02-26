'use client'

import { useState, useEffect } from 'react'
import { LogOut, LogIn, Trash2, Shield, CreditCard, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n'
import { useSubscription } from '@/lib/subscription-context'
import AuthPrompt from '@/components/AuthPrompt'
import PlanBadge from '@/components/PlanBadge'
import Button from '@/components/ui/Button'
import SectionGroup from '@/components/ui/SectionGroup'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import PageHeader from '@/components/ui/PageHeader'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const { t } = useI18n()
  const { usage } = useSubscription()

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

  const handleManageSubscription = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/create-portal', { method: 'POST' })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      setPortalLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('settings_title')} />

      {/* Subscription */}
      {user && (
        <SectionGroup title={t('settings_subscription')}>
          <div className="bg-white rounded-card p-4 border border-border flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} strokeWidth={1.5} className="text-text-tertiary" />
                  <span className="text-body text-text-primary font-medium">
                    {t('settings_current_plan')}
                  </span>
                </div>
                {usage && <PlanBadge plan={usage.plan} />}
              </div>

              {usage && (
                <div className="text-caption text-text-secondary">
                  {usage.used} / {usage.limit} {t('usage_analyses_used')}
                  {usage.bonus_credits > 0 && (
                    <span className="text-warning"> + {usage.bonus_credits} {t('usage_credits')}</span>
                  )}
                </div>
              )}
            </div>

            {usage && usage.plan !== 'free' ? (
              <Button
                variant="ghost"
                fullWidth
                onClick={handleManageSubscription}
                disabled={portalLoading}
              >
                {t('settings_manage_subscription')}
                <ArrowRight size={14} strokeWidth={1.5} />
              </Button>
            ) : (
              <Link href="/app/pricing">
                <Button variant="primary" fullWidth>
                  {t('upgrade')}
                  <ArrowRight size={14} strokeWidth={1.5} />
                </Button>
              </Link>
            )}
          </div>
        </SectionGroup>
      )}

      {/* Account */}
      <SectionGroup title={t('settings_account')}>
        {loading ? (
          <div className="h-14 bg-white rounded-card animate-shimmer shimmer" />
        ) : user ? (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-card p-4 border border-border flex flex-col gap-1">
              <p className="text-caption text-text-tertiary">{t('settings_signed_in_as')}</p>
              <p className="text-body text-text-primary font-medium">
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
          <Shield size={18} strokeWidth={1.5} className="text-success flex-shrink-0 mt-0.5" />
          <p className="text-body text-text-secondary">
            {t('settings_privacy_note')}
          </p>
        </div>
        {user && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 text-body text-text-tertiary hover:text-danger transition-colors min-h-[44px] w-full"
          >
            <Trash2 size={16} strokeWidth={1.5} />
            {t('settings_delete_data')}
          </button>
        )}
      </SectionGroup>

      {/* Legal */}
      <div className="flex items-center justify-center gap-3 text-caption text-text-tertiary pt-4">
        <Link href="/privacy" className="underline hover:text-text-secondary transition-colors">
          {t('privacy_policy_title')}
        </Link>
        <span>·</span>
        <Link href="/terms" className="underline hover:text-text-secondary transition-colors">
          {t('terms_title')}
        </Link>
      </div>

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
