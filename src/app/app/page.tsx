'use client'

import { useState, useEffect } from 'react'
import { AnalysisResult, Person } from '@/types/analysis'
import ConversationInput from '@/components/ConversationInput'
import AnalysisResults from '@/components/AnalysisResults'
import AuthPrompt from '@/components/AuthPrompt'
import PersonSelector from '@/components/PersonSelector'
import { AnalysisSkeleton } from '@/components/ui/Skeleton'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { useI18n } from '@/lib/i18n'
import { AlertCircle } from 'lucide-react'
import { PERSON_CONTEXT_PREFIX } from '@/lib/prompts'
import type { User } from '@supabase/supabase-js'

type AppView = 'input' | 'loading' | 'results'

export default function AppPage() {
  const [view, setView] = useState<AppView>('input')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [inputText, setInputText] = useState<string>('')
  const [inputType, setInputType] = useState<'text' | 'screenshot'>('text')
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [hasUsedFreeAnalysis, setHasUsedFreeAnalysis] = useState(false)
  const [people, setPeople] = useState<Person[]>([])
  const [selectedPersonForContext, setSelectedPersonForContext] = useState<Person | null>(null)
  const [showPersonSelector, setShowPersonSelector] = useState(false)
  const { showToast } = useToast()
  const { t } = useI18n()

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) loadPeople()
    })

    const used = localStorage.getItem('subtext_free_analysis_used')
    if (used) setHasUsedFreeAnalysis(true)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        setShowAuth(false)
        loadPeople()
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const loadPeople = async () => {
    const { data } = await supabase
      .from('people')
      .select('*')
      .order('name')
    setPeople((data as Person[]) || [])
  }

  const handleSubmit = async (data: { text?: string; screenshot?: string }) => {
    setView('loading')
    setError(null)
    setInputText(data.text || '[Screenshot]')
    setInputType(data.screenshot ? 'screenshot' : 'text')

    try {
      let personContext: string | undefined

      if (selectedPersonForContext) {
        const { data: pastAnalyses } = await supabase
          .from('analyses')
          .select('analysis_json')
          .eq('person_id', selectedPersonForContext.id)
          .order('created_at', { ascending: false })
          .limit(5)

        if (pastAnalyses && pastAnalyses.length > 0) {
          const summaries = pastAnalyses.map(
            (a: { analysis_json: AnalysisResult }) => a.analysis_json.overall_read
          )
          personContext = PERSON_CONTEXT_PREFIX(selectedPersonForContext.name, summaries)
        }
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, personContext }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Analysis failed')
      }

      const result: AnalysisResult = await res.json()
      setAnalysis(result)
      setView('results')

      if (!user) {
        localStorage.setItem('subtext_free_analysis_used', 'true')
        setHasUsedFreeAnalysis(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setView('input')
    }
  }

  const handleBack = () => {
    setView('input')
    setAnalysis(null)
    setShowAuth(false)
  }

  const handleSave = async () => {
    if (!user) {
      setShowAuth(true)
      return
    }
    if (!analysis) return
    setShowPersonSelector(true)
  }

  const handleSaveWithPerson = async (person: Person) => {
    setShowPersonSelector(false)
    if (!analysis || !user) return

    const { error } = await supabase.from('analyses').insert({
      user_id: user.id,
      input_text: inputText,
      input_type: inputType,
      analysis_json: analysis,
      language: analysis.language,
      person_id: person.id,
      contact_label: person.name,
    })

    if (error) {
      showToast(t('save_failed'))
    } else {
      showToast(t('saved'))
      // Refresh people list in case a new person was created
      loadPeople()
    }
  }

  return (
    <div>
      {view === 'input' && (
        <div className="mb-8 pt-4 text-center">
          <h1 className="font-serif text-display text-text-primary">{t('app_name')}</h1>
          <p className="text-body text-text-secondary mt-2 max-w-md mx-auto">
            {t('main_subtitle')}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-danger-bg text-danger-text text-body rounded-card flex items-start gap-3">
          <AlertCircle size={18} strokeWidth={1.5} className="text-danger mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {view === 'input' && (
        <>
          {user && people.length > 0 && (
            <div className="mb-4">
              <p className="text-caption text-text-secondary mb-2">{t('analyzing_conversation_with')}</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedPersonForContext(null)}
                  className={`px-3 py-1.5 rounded-full text-caption border transition-all ${
                    !selectedPersonForContext
                      ? 'border-accent text-accent font-medium bg-accent/5'
                      : 'border-border text-text-tertiary hover:border-text-tertiary'
                  }`}
                >
                  {t('anyone')}
                </button>
                {people.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPersonForContext(p)}
                    className={`px-3 py-1.5 rounded-full text-caption flex items-center gap-1.5 border transition-all ${
                      selectedPersonForContext?.id === p.id
                        ? 'border-accent text-accent font-medium bg-accent/5'
                        : 'border-border text-text-tertiary hover:border-text-tertiary'
                    }`}
                  >
                    <span>{p.avatar_emoji}</span>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <ConversationInput onSubmit={handleSubmit} isLoading={false} />
        </>
      )}

      {view === 'loading' && <AnalysisSkeleton />}

      {view === 'results' && analysis && (
        <>
          <AnalysisResults
            analysis={analysis}
            onBack={handleBack}
            onSave={handleSave}
            showSave={true}
          />

          {!user && hasUsedFreeAnalysis && showAuth && (
            <div className="mt-card-gap">
              <AuthPrompt />
            </div>
          )}

          {!user && hasUsedFreeAnalysis && !showAuth && (
            <button
              onClick={() => setShowAuth(true)}
              className="w-full mt-4 text-center text-caption text-text-tertiary hover:text-accent transition-colors py-2"
            >
              {t('auth_nudge')}
            </button>
          )}
        </>
      )}

      <PersonSelector
        open={showPersonSelector}
        onClose={() => setShowPersonSelector(false)}
        onSelect={handleSaveWithPerson}
      />
    </div>
  )
}
