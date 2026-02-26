'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Person, SavedAnalysis, AnalysisResult } from '@/types/analysis'
import PersonCard from '@/components/PersonCard'
import AddPersonForm from '@/components/AddPersonForm'
import CompactInput from '@/components/CompactInput'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import BottomSheet from '@/components/ui/BottomSheet'
import Skeleton from '@/components/ui/Skeleton'
import { LogIn, Users, ArrowLeft, Plus, Trash2, ChevronRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useSubscription } from '@/lib/subscription-context'
import { PERSON_CONTEXT_PREFIX } from '@/lib/prompts'
import Link from 'next/link'
import type { TranslationKey } from '@/lib/i18n'

function formatTimeAgo(dateStr: string, t: (key: TranslationKey) => string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return t('time_ago_just_now')
  if (diffHours < 24) return `${diffHours}${t('time_ago_hours')}`
  return `${diffDays}${t('time_ago_days')}`
}

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([])
  const [analysisCounts, setAnalysisCounts] = useState<Record<string, number>>({})
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [personAnalyses, setPersonAnalyses] = useState<SavedAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingAnalyses, setLoadingAnalyses] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [deletePersonTarget, setDeletePersonTarget] = useState<Person | null>(null)
  const [optionsPerson, setOptionsPerson] = useState<Person | null>(null)
  const [newAnalysisId, setNewAnalysisId] = useState<string | null>(null)
  const { t } = useI18n()
  const { usage, refreshUsage } = useSubscription()
  const searchParams = useSearchParams()
  const router = useRouter()

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

      const { data: peopleData } = await supabase
        .from('people')
        .select('*')
        .order('updated_at', { ascending: false })

      const loadedPeople = (peopleData as Person[]) || []
      setPeople(loadedPeople)

      if (loadedPeople.length > 0) {
        const { data: analyses } = await supabase
          .from('analyses')
          .select('person_id')
          .not('person_id', 'is', null)

        if (analyses) {
          const counts: Record<string, number> = {}
          analyses.forEach((a: { person_id: string }) => {
            counts[a.person_id] = (counts[a.person_id] || 0) + 1
          })
          setAnalysisCounts(counts)
        }
      }

      // Restore selected person from URL param before clearing loading
      // to avoid a flash of the people list
      const personParam = searchParams.get('person')
      const matchedPerson = personParam
        ? loadedPeople.find((p) => p.id === personParam)
        : null

      if (matchedPerson) {
        setSelectedPerson(matchedPerson)
      }

      setLoading(false)

      if (matchedPerson) {
        loadPersonAnalyses(matchedPerson)
      }
    }

    load()
  }, [supabase, searchParams])

  const loadPersonAnalyses = async (person: Person) => {
    setSelectedPerson(person)
    setLoadingAnalyses(true)

    const { data } = await supabase
      .from('analyses')
      .select('*')
      .eq('person_id', person.id)
      .order('created_at', { ascending: false })
      .limit(50)

    setPersonAnalyses((data as SavedAnalysis[]) || [])
    setLoadingAnalyses(false)
  }

  const handleSelectPerson = (person: Person) => {
    router.replace(`/app/people?person=${person.id}`, { scroll: false })
    loadPersonAnalyses(person)
  }

  const handleAddPerson = async (name: string, emoji: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('people')
      .insert({ user_id: user.id, name, avatar_emoji: emoji })
      .select()
      .single()

    if (!error && data) {
      setPeople((prev) => [data as Person, ...prev])
      setShowAddForm(false)
    }
  }

  const handleDeletePerson = async () => {
    if (!deletePersonTarget) return
    await supabase.from('people').delete().eq('id', deletePersonTarget.id)
    setPeople((prev) => prev.filter((p) => p.id !== deletePersonTarget.id))
    if (selectedPerson?.id === deletePersonTarget.id) {
      setSelectedPerson(null)
    }
    setDeletePersonTarget(null)
    setOptionsPerson(null)
  }

  const handleSubmitForPerson = async (data: { text?: string; screenshot?: string }) => {
    if (!selectedPerson) return
    setIsAnalyzing(true)

    try {
      let personContext: string | undefined
      if (personAnalyses.length > 0) {
        const summaries = personAnalyses.slice(0, 5).map(a => a.analysis_json.overall_read)
        personContext = PERSON_CONTEXT_PREFIX(selectedPerson.name, summaries)
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, personContext }),
      })

      if (!res.ok) {
        setIsAnalyzing(false)
        return
      }

      const result: AnalysisResult = await res.json()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: saved } = await supabase.from('analyses').insert({
        user_id: user.id,
        input_text: data.text || '[Screenshot]',
        input_type: data.screenshot ? 'screenshot' : 'text',
        analysis_json: result,
        language: result.language,
        person_id: selectedPerson.id,
        contact_label: selectedPerson.name,
      }).select().single()

      if (saved) {
        const savedAnalysis = saved as SavedAnalysis
        setNewAnalysisId(savedAnalysis.id)
        setPersonAnalyses(prev => [savedAnalysis, ...prev])
        setAnalysisCounts(prev => ({
          ...prev,
          [selectedPerson.id]: (prev[selectedPerson.id] || 0) + 1,
        }))
        setTimeout(() => setNewAnalysisId(null), 600)
      }

      refreshUsage()
    } catch {
      // silently fail
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleBack = () => {
    router.replace('/app/people', { scroll: false })
    setSelectedPerson(null)
    setPersonAnalyses([])
  }

  const remaining = usage ? Math.max(0, usage.limit + usage.bonus_credits - usage.used) : undefined
  const total = usage ? usage.limit + usage.bonus_credits : undefined

  const personIdFromUrl = searchParams.get('person')

  // Loading - show skeleton matching the expected view
  if (loading || (personIdFromUrl && !selectedPerson)) {
    if (personIdFromUrl) {
      // Will show person detail, use matching skeleton
      return (
        <div className="flex flex-col gap-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="min-h-[44px] min-w-[44px]" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="flex flex-col">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 px-2 py-3.5">
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return (
      <div>
        <h1 className="text-title text-text-primary mb-6">{t('people_title')}</h1>
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-bg-surface rounded-card p-4 border border-border flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthed) {
    return (
      <div>
        <h1 className="text-title text-text-primary mb-6">{t('people_title')}</h1>
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center">
            <LogIn size={24} strokeWidth={1.5} className="text-text-tertiary" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-subtitle text-text-primary">{t('history_sign_in')}</p>
            <p className="text-body text-text-secondary">{t('history_sign_in_subtitle')}</p>
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

  // Person detail: Claude Chats-style flat list
  if (selectedPerson) {
    return (
      <div className="flex flex-col gap-4 pb-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-1 text-text-secondary hover:text-text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
          </button>
          <div className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-xl flex-shrink-0">
            {selectedPerson.avatar_emoji}
          </div>
          <div className="flex flex-col gap-0 flex-1">
            <h1 className="text-subtitle text-text-primary">{selectedPerson.name}</h1>
            <p className="text-caption text-text-tertiary">
              {analysisCounts[selectedPerson.id] || 0} {t('analyses_count')}
            </p>
          </div>
        </div>

        {/* Analyses list: flat rows like Claude Chats */}
        {loadingAnalyses ? (
          <div className="flex flex-col">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 px-2 py-3.5">
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : personAnalyses.length === 0 && !isAnalyzing ? (
          <div className="text-center py-12 flex flex-col items-center gap-2">
            <p className="text-subtitle text-text-primary">{t('no_readings_yet')}</p>
            <p className="text-body text-text-tertiary">{t('no_readings_person_subtitle')}</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {personAnalyses.map((item) => (
              <Link
                key={item.id}
                href={`/app/analysis/${item.id}`}
                className={`flex items-center gap-3 px-2 py-3.5 hover:bg-bg-secondary transition-colors group ${
                  item.id === newAnalysisId ? 'opacity-0 animate-reveal-in' : ''
                }`}
                style={item.id === newAnalysisId ? { animationFillMode: 'forwards' } : undefined}
              >
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <p className="text-body text-text-primary truncate">
                    {item.analysis_json.overall_read.slice(0, 80)}
                  </p>
                  <span className="text-caption text-text-tertiary">
                    {formatTimeAgo(item.created_at, t)}
                  </span>
                </div>
                <ChevronRight size={16} strokeWidth={1.5} className="text-text-tertiary flex-shrink-0" />
              </Link>
            ))}

            {/* Thinking dots row */}
            {isAnalyzing && (
              <div className="flex items-center gap-3 px-2 py-3.5 animate-fade-in-up">
                <div className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-base flex-shrink-0">
                  {selectedPerson.avatar_emoji}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent/60 animate-thinking-dot" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-accent/60 animate-thinking-dot" style={{ animationDelay: '160ms' }} />
                  <span className="w-2 h-2 rounded-full bg-accent/60 animate-thinking-dot" style={{ animationDelay: '320ms' }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sticky input with pre-selected person */}
        <CompactInput
          onSubmit={handleSubmitForPerson}
          isLoading={isAnalyzing}
          remaining={remaining}
          total={total}
          animateSend
        />
      </div>
    )
  }

  // People list view
  return (
    <div className="pb-24">
      <h1 className="text-title text-text-primary mb-6">{t('people_title')}</h1>

      {people.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center">
            <Users size={24} strokeWidth={1.5} className="text-text-tertiary" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-subtitle text-text-primary">{t('people_empty_title')}</p>
            <p className="text-body text-text-secondary">{t('people_empty_subtitle')}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {people.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              analysisCount={analysisCounts[person.id] || 0}
              onClick={() => handleSelectPerson(person)}
              onOptions={() => setOptionsPerson(person)}
            />
          ))}
        </div>
      )}

      {/* FAB - floating add button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-accent text-white shadow-lg hover:bg-accent-hover transition-colors flex items-center justify-center z-40"
      >
        <Plus size={24} strokeWidth={2} />
      </button>

      <AddPersonForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={handleAddPerson}
      />

      <BottomSheet
        open={optionsPerson !== null}
        onClose={() => setOptionsPerson(null)}
      >
        <div className="flex flex-col gap-1">
          <button
            onClick={() => {
              if (optionsPerson) setDeletePersonTarget(optionsPerson)
            }}
            className="flex items-center gap-3 px-2 py-3 rounded-card hover:bg-bg-secondary transition-colors text-danger min-h-[44px]"
          >
            <Trash2 size={18} strokeWidth={1.5} />
            <span className="text-body">{t('delete_person')}</span>
          </button>
        </div>
      </BottomSheet>

      <ConfirmDialog
        open={deletePersonTarget !== null && !selectedPerson}
        onClose={() => { setDeletePersonTarget(null); setOptionsPerson(null) }}
        onConfirm={handleDeletePerson}
        title={t('confirm_delete_person_title')}
        description={t('delete_person_confirm')}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        variant="danger"
      />
    </div>
  )
}
