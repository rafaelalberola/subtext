'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SavedAnalysis } from '@/types/analysis'
import AnalysisResults from '@/components/AnalysisResults'
import ActionMenu from '@/components/ui/ActionMenu'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { AnalysisSkeleton } from '@/components/ui/Skeleton'
import { useSubscription } from '@/lib/subscription-context'
import { useI18n } from '@/lib/i18n'

export default function AnalysisDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<SavedAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { usage } = useSubscription()
  const { t } = useI18n()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .single()

      const saved = data as SavedAnalysis | null
      setAnalysis(saved)

      setLoading(false)
    }
    load()
  }, [id, supabase])

  const handleDelete = async () => {
    await supabase.from('analyses').delete().eq('id', id)
    setShowDeleteConfirm(false)
    router.back()
  }

  if (loading) return <AnalysisSkeleton />

  if (!analysis) {
    return (
      <div className="text-center py-16">
        <p className="text-body text-text-secondary">Analysis not found</p>
      </div>
    )
  }

  return (
    <>
      <AnalysisResults
        analysis={analysis.analysis_json}
        onBack={() => router.back()}
        plan={usage?.plan || 'free'}
        contactName={analysis.contact_label}
        personId={analysis.person_id}
        inputText={analysis.input_text}
        createdAt={analysis.created_at}
        headerAction={
          <ActionMenu
            items={[
              {
                label: t('delete_analysis'),
                icon: <Trash2 size={16} strokeWidth={1.5} />,
                onClick: () => setShowDeleteConfirm(true),
                variant: 'danger',
              },
            ]}
          />
        }
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={t('confirm_delete_analysis_title')}
        description={t('confirm_delete_analysis_desc')}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        variant="danger"
      />
    </>
  )
}
