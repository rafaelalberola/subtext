'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import BottomSheet from '@/components/ui/BottomSheet'
import AddPersonForm from '@/components/AddPersonForm'
import { createClient } from '@/lib/supabase/client'
import { Person } from '@/types/analysis'
import { useI18n } from '@/lib/i18n'

interface PersonSelectorProps {
  open: boolean
  onClose: () => void
  onSelect: (person: Person) => void
}

export default function PersonSelector({ open, onClose, onSelect }: PersonSelectorProps) {
  const [people, setPeople] = useState<Person[]>([])
  const [loaded, setLoaded] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const { t } = useI18n()
  const supabase = createClient()

  useEffect(() => {
    if (!open) return
    supabase
      .from('people')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setPeople((data as Person[]) || [])
        setLoaded(true)
      })
  }, [open, supabase])

  const handleAddPerson = async (name: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('people')
      .insert({ user_id: user.id, name })
      .select()
      .single()

    if (!error && data) {
      const newPerson = data as Person
      setPeople((prev) => [...prev, newPerson])
      setShowAdd(false)
      onSelect(newPerson)
    }
  }

  return (
    <>
      <BottomSheet open={open && !showAdd && loaded} onClose={onClose} title={t('save_to_person')}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            {people.map((person) => (
              <button
                key={person.id}
                onClick={() => onSelect(person)}
                className="w-full py-2 px-4 rounded-card bg-bg-surface border border-border text-left flex items-center gap-3 hover:border-text-tertiary transition-all duration-200 min-h-[44px] group"
              >
                <div className="w-9 h-9 rounded-full bg-bg-secondary flex items-center justify-center text-body font-medium text-text-tertiary flex-shrink-0 group-hover:bg-accent/5 transition-colors">
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-body text-text-primary font-medium">{person.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="w-full p-3 rounded-button flex items-center justify-center gap-2 bg-accent text-white hover:bg-accent-hover transition-colors min-h-[44px]"
          >
            <Plus size={18} strokeWidth={2} />
            <span className="text-body font-medium">{t('create_person')}</span>
          </button>
        </div>
      </BottomSheet>

      <AddPersonForm open={showAdd} onClose={() => { setShowAdd(false); onClose() }} onSave={handleAddPerson} />
    </>
  )
}
