'use client'

import { useState, useEffect } from 'react'
import { AnalysisResult, Person } from '@/types/analysis'
import CompactInput from '@/components/CompactInput'
import AnalysisResults from '@/components/AnalysisResults'
import AuthPrompt from '@/components/AuthPrompt'
import PersonSelector from '@/components/PersonSelector'
import AddPersonForm from '@/components/AddPersonForm'
import PersonHeader from '@/components/chat/PersonHeader'
import UpgradePrompt, { LowUsageBanner } from '@/components/UpgradePrompt'
import Skeleton, { AnalysisSkeleton } from '@/components/ui/Skeleton'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { useI18n } from '@/lib/i18n'
import { useSubscription } from '@/lib/subscription-context'
import { AlertCircle, Sparkles } from 'lucide-react'
import { PERSON_CONTEXT_PREFIX } from '@/lib/prompts'
import type { User } from '@supabase/supabase-js'

type AppView = 'input' | 'loading' | 'results'

const ANALYSIS_STORAGE_KEY = 'reveald_pending_analysis'

export default function AppPage() {
  const [view, setView] = useState<AppView>('input')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [inputText, setInputText] = useState<string>('')
  const [inputType, setInputType] = useState<'text' | 'screenshot'>('text')
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [peopleLoading, setPeopleLoading] = useState(true)
  const [people, setPeople] = useState<Person[]>([])
  const [selectedPersonForContext, setSelectedPersonForContext] = useState<Person | null>(null)
  const [showPersonSelector, setShowPersonSelector] = useState(false)
  const [showPersonPicker, setShowPersonPicker] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showAddPerson, setShowAddPerson] = useState(false)
  const [pendingSubmitData, setPendingSubmitData] = useState<{ text?: string; screenshot?: string } | null>(null)
  const { showToast } = useToast()
  const { t } = useI18n()
  const { usage, loading: usageLoading, refreshUsage } = useSubscription()

  const supabase = createClient()

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(ANALYSIS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setAnalysis(parsed.analysis)
        setInputText(parsed.inputText || '')
        setInputType(parsed.inputType || 'text')
        setView('results')
        sessionStorage.removeItem(ANALYSIS_STORAGE_KEY)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setAuthLoading(false)
      if (user) {
        loadPeople()
      } else {
        setPeopleLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
      if (session?.user) {
        loadPeople()
        refreshUsage()
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
    setPeopleLoading(false)
  }

  const persistAnalysis = () => {
    if (analysis) {
      sessionStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify({
        analysis, inputText, inputType,
      }))
    }
  }

  const handleSubmit = async (data: { text?: string; screenshot?: string }) => {
    // If no person selected, prompt to select or create one
    if (!selectedPersonForContext) {
      setPendingSubmitData(data)
      if (people.length === 0) {
        setShowAddPerson(true)
      } else {
        setShowPersonPicker(true)
      }
      return
    }

    await runAnalysis(data)
  }

  const runAnalysis = async (data: { text?: string; screenshot?: string }) => {
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

      if (res.status === 401) { setView('input'); return }
      if (res.status === 402) { setShowUpgrade(true); setView('input'); return }

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Analysis failed')
      }

      const result: AnalysisResult = await res.json()
      setAnalysis(result)
      setView('results')
      refreshUsage()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setView('input')
    }
  }

  const handleBack = () => {
    setView('input')
    setAnalysis(null)
    sessionStorage.removeItem(ANALYSIS_STORAGE_KEY)
  }

  const handleSave = async () => {
    if (!user || !analysis) return
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
      loadPeople()
    }
  }

  useEffect(() => {
    if (view === 'results' && analysis) persistAnalysis()
  }, [view, analysis])

  const remaining = usage ? Math.max(0, usage.limit + usage.bonus_credits - usage.used) : undefined
  const total = usage ? usage.limit + usage.bonus_credits : undefined

  const isReady = !authLoading && !peopleLoading && !usageLoading

  // Loading state
  if (!isReady) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center"
        style={{ minHeight: 'calc(100vh - 280px)' }}
      >
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-32 h-8" />
          <Skeleton className="w-48 h-5" />
        </div>
      </div>
    )
  }

  // Auth prompt
  if (!user) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="pt-4 text-center flex flex-col gap-2">
          <h1 className="font-serif text-display text-text-primary">{t('app_name')}</h1>
          <p className="text-body text-text-secondary max-w-md mx-auto">{t('main_subtitle')}</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2 bg-success-bg rounded-card px-4 py-3">
            <span className="text-success text-body">✓</span>
            <p className="text-body text-success-text font-medium">{t('auth_required_subtitle')}</p>
          </div>
          <AuthPrompt />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Input view: centered Claude-like layout */}
      {view === 'input' && (
        <>
          <div
            className="flex flex-col items-center justify-center text-center"
            style={{ minHeight: 'calc(100vh - 280px)' }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center">
                <Sparkles size={24} strokeWidth={1.5} className="text-text-tertiary" />
              </div>
              <h1 className="font-serif text-display text-text-primary">{t('app_name')}</h1>
              <p className="text-body text-text-secondary max-w-[16rem]">{t('main_subtitle')}</p>
            </div>

            {/* Person selector */}
            {user && (
              <div className="mt-8 w-full">
                {selectedPersonForContext ? (
                  <PersonHeader
                    person={selectedPersonForContext}
                    onChangePress={() => setShowPersonPicker(true)}
                  />
                ) : people.length > 0 ? (
                  <div className="flex flex-col gap-2 items-center">
                    <p className="text-caption text-text-secondary">{t('analyzing_conversation_with')}</p>
                    <div className="flex gap-2 flex-wrap justify-center">
                      {people.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPersonForContext(p)}
                          className="px-3 py-1.5 rounded-full text-caption flex items-center gap-1.5 border transition-all border-border text-text-tertiary hover:border-text-tertiary"
                        >
                          <span>{p.avatar_emoji}</span>
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {usage && usage.remaining === 1 && <LowUsageBanner />}
        </>
      )}

      {error && (
        <div className="p-4 bg-danger-bg text-danger-text text-body rounded-card flex items-start gap-3">
          <AlertCircle size={18} strokeWidth={1.5} className="text-danger mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {view === 'loading' && <AnalysisSkeleton />}

      {view === 'results' && analysis && (
        <AnalysisResults
          analysis={analysis}
          onBack={handleBack}
          onSave={handleSave}
          showSave={true}
          plan={usage?.plan || 'free'}
          contactName={selectedPersonForContext?.name}
          inputText={inputText}
        />
      )}

      {/* Sticky compact input */}
      {user && view !== 'loading' && (
        <CompactInput
          onSubmit={handleSubmit}
          isLoading={false}
          remaining={remaining}
          total={total}
        />
      )}

      {showPersonPicker && (
        <PersonSelector
          open={showPersonPicker}
          onClose={() => { setShowPersonPicker(false); setPendingSubmitData(null) }}
          onSelect={(person) => {
            setSelectedPersonForContext(person)
            setShowPersonPicker(false)
            if (pendingSubmitData) {
              const data = pendingSubmitData
              setPendingSubmitData(null)
              setTimeout(() => runAnalysis(data), 0)
            }
          }}
        />
      )}

      <PersonSelector
        open={showPersonSelector}
        onClose={() => setShowPersonSelector(false)}
        onSelect={handleSaveWithPerson}
      />

      <UpgradePrompt
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
      />

      <AddPersonForm
        open={showAddPerson}
        onClose={() => { setShowAddPerson(false); setPendingSubmitData(null) }}
        onSave={async (name, emoji) => {
          setShowAddPerson(false)
          if (!user) return
          const { data: newPerson, error } = await supabase
            .from('people')
            .insert({ user_id: user.id, name, avatar_emoji: emoji })
            .select()
            .single()
          if (error || !newPerson) {
            showToast(t('save_failed'))
            setPendingSubmitData(null)
            return
          }
          const person = newPerson as Person
          setPeople((prev) => [...prev, person].sort((a, b) => a.name.localeCompare(b.name)))
          setSelectedPersonForContext(person)
          if (pendingSubmitData) {
            const data = pendingSubmitData
            setPendingSubmitData(null)
            setTimeout(() => runAnalysis(data), 0)
          }
        }}
      />
    </div>
  )
}
