'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Person, SavedAnalysis } from '@/types/analysis'
import PersonCard from '@/components/PersonCard'
import HistoryList from '@/components/HistoryList'
import AddPersonForm from '@/components/AddPersonForm'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Skeleton from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import { LogIn, Users, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import Link from 'next/link'

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([])
  const [analysisCounts, setAnalysisCounts] = useState<Record<string, number>>({})
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [personAnalyses, setPersonAnalyses] = useState<SavedAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingAnalyses, setLoadingAnalyses] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [deletePersonTarget, setDeletePersonTarget] = useState<Person | null>(null)
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

      setLoading(false)
    }

    load()
  }, [supabase])

  const handleSelectPerson = async (person: Person) => {
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
  }

  const handleDeleteAnalysis = async (id: string) => {
    await supabase.from('analyses').delete().eq('id', id)
    setPersonAnalyses((prev) => prev.filter((a) => a.id !== id))
    if (selectedPerson) {
      setAnalysisCounts((prev) => ({
        ...prev,
        [selectedPerson.id]: (prev[selectedPerson.id] || 1) - 1,
      }))
    }
  }

  const handleBack = () => {
    setSelectedPerson(null)
    setPersonAnalyses([])
  }

  // Loading state
  if (loading) {
    return (
      <div>
        <h1 className="text-title text-text-primary mb-6">{t('people_title')}</h1>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-bg-surface rounded-card p-4 border border-border flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
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
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mx-auto">
            <LogIn size={24} strokeWidth={1.5} className="text-text-tertiary" />
          </div>
          <div>
            <p className="text-subtitle text-text-primary">{t('history_sign_in')}</p>
            <p className="text-body text-text-secondary mt-1">
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

  // Person detail view
  if (selectedPerson) {
    return (
      <div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-body text-text-secondary hover:text-text-primary transition-colors mb-4 min-h-[44px]"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
          {t('back')}
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-bg-secondary flex items-center justify-center text-3xl flex-shrink-0">
            {selectedPerson.avatar_emoji}
          </div>
          <div className="flex-1">
            <h1 className="text-title text-text-primary">{selectedPerson.name}</h1>
            <p className="text-caption text-text-tertiary">
              {analysisCounts[selectedPerson.id] || 0} {t('analyses_count')}
            </p>
          </div>
        </div>

        {loadingAnalyses ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="bg-bg-surface rounded-card p-4 border border-border space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <HistoryList analyses={personAnalyses} onDelete={handleDeleteAnalysis} />
        )}

        {/* Delete person */}
        <div className="mt-8 pt-4 border-t border-border">
          <button
            onClick={() => setDeletePersonTarget(selectedPerson)}
            className="flex items-center gap-2 text-body text-text-tertiary hover:text-danger transition-colors min-h-[44px]"
          >
            <Trash2 size={16} strokeWidth={1.5} />
            {t('delete_person')}
          </button>
        </div>

        <ConfirmDialog
          open={deletePersonTarget !== null}
          onClose={() => setDeletePersonTarget(null)}
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

  // People list view
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-title text-text-primary">{t('people_title')}</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 text-accent text-body font-medium hover:text-accent-hover transition-colors min-h-[44px] px-2"
        >
          <Plus size={18} strokeWidth={2} />
          {t('add_person')}
        </button>
      </div>

      {people.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mx-auto">
            <Users size={24} strokeWidth={1.5} className="text-text-tertiary" />
          </div>
          <div>
            <p className="text-subtitle text-text-primary">{t('people_empty_title')}</p>
            <p className="text-body text-text-secondary mt-1">
              {t('people_empty_subtitle')}
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowAddForm(true)}>
            {t('add_person')}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {people.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              analysisCount={analysisCounts[person.id] || 0}
              onClick={() => handleSelectPerson(person)}
              onDelete={() => setDeletePersonTarget(person)}
            />
          ))}
        </div>
      )}

      <AddPersonForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={handleAddPerson}
      />

      <ConfirmDialog
        open={deletePersonTarget !== null && !selectedPerson}
        onClose={() => setDeletePersonTarget(null)}
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
