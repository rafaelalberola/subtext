'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SavedAnalysis } from '@/types/analysis'
import HistoryList from '@/components/HistoryList'
import Skeleton from '@/components/ui/Skeleton'
import { LogIn } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import Link from 'next/link'

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const { t } = useI18n()

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsAuthed(false)
        setLoading(false)
        return
      }

      setIsAuthed(true)
      const { data } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      setAnalyses((data as SavedAnalysis[]) || [])
      setLoading(false)
    }

    load()
  }, [supabase])

  const handleDelete = async (id: string) => {
    await supabase.from('analyses').delete().eq('id', id)
    setAnalyses((prev) => prev.filter((a) => a.id !== id))
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-title text-text-primary mb-6">{t('history_title')}</h1>
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-bg-surface rounded-card p-4 border border-border flex flex-col gap-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!isAuthed) {
    return (
      <div>
        <h1 className="text-title text-text-primary mb-6">{t('history_title')}</h1>
        <div className="text-center py-16 flex flex-col gap-4">
          <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mx-auto">
            <LogIn size={24} strokeWidth={1.5} className="text-text-tertiary" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-subtitle text-text-primary">{t('history_sign_in')}</p>
            <p className="text-body text-text-secondary">
              {t('history_sign_in_subtitle')}
            </p>
          </div>
          <Link
            href="/app"
            className="inline-flex items-center text-accent text-body font-medium hover:text-accent-hover transition-colors"
          >
            {t('go_to_analyze')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-title text-text-primary mb-6">{t('history_title')}</h1>
      <HistoryList analyses={analyses} onDelete={handleDelete} />
    </div>
  )
}
