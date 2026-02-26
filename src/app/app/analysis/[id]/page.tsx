'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SavedAnalysis } from '@/types/analysis'
import AnalysisResults from '@/components/AnalysisResults'
import { AnalysisSkeleton } from '@/components/ui/Skeleton'
import { useSubscription } from '@/lib/subscription-context'

export default function AnalysisDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<SavedAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const { usage } = useSubscription()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .single()

      setAnalysis(data as SavedAnalysis | null)
      setLoading(false)
    }
    load()
  }, [id, supabase])

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
        showSave={false}
        plan={usage?.plan || 'free'}
        contactName={analysis.contact_label}
        inputText={analysis.input_text}
        createdAt={analysis.created_at}
      />
    </>
  )
}
