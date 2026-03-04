'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n'

interface AuthPromptProps {
  onAuthSuccess?: () => void
  redirectTo?: string
}

export default function AuthPrompt({ onAuthSuccess, redirectTo }: AuthPromptProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t, locale } = useI18n()
  const supabase = createClient()

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || `${window.location.origin}/app`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo || `${window.location.origin}/app`,
        data: { locale },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="bg-bg-surface rounded-card p-section border border-border text-center flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
          <Mail size={20} className="text-success" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-subtitle text-text-primary">{t('auth_check_email')}</h3>
          <p className="text-body text-text-secondary">
            {t('auth_email_sent')} <strong>{email}</strong>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-surface rounded-card p-section border border-border flex flex-col gap-5">
      <div className="text-center flex flex-col gap-2">
        <h3 className="text-subtitle text-text-primary">
          {t('auth_save_title')}
        </h3>
        <p className="text-body text-text-secondary">
          {t('auth_save_subtitle_1')}<br />{t('auth_save_subtitle_2')}
        </p>
      </div>

      {error && (
        <p className="text-caption text-danger text-center">{error}</p>
      )}

      {/* Google sign in */}
      <Button
        variant="secondary"
        fullWidth
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {t('auth_google')}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-caption text-text-tertiary">{t('auth_or')}</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Magic link */}
      <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth_email_placeholder')}
          className="w-full h-14 px-4 rounded-input bg-bg-secondary text-body text-text-primary placeholder:text-text-tertiary border-2 border-transparent focus:border-accent focus:bg-white focus:outline-none transition-all duration-200"
          disabled={loading}
        />
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={!email.trim() || loading}
        >
          <Mail size={16} strokeWidth={1.5} />
          {t('auth_magic_link')}
        </Button>
      </form>
    </div>
  )
}
