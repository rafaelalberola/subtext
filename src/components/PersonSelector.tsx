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
      })
  }, [open, supabase])

  const handleAddPerson = async (name: string, emoji: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('people')
      .insert({ user_id: user.id, name, avatar_emoji: emoji })
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
      <BottomSheet open={open && !showAdd} onClose={onClose} title={t('save_to_person')}>
        <div className="space-y-2">
          {people.map((person) => (
            <button
              key={person.id}
              onClick={() => onSelect(person)}
              className="w-full p-3 rounded-button bg-bg-secondary text-left flex items-center gap-3 hover:bg-border transition-colors min-h-[44px]"
            >
              <span className="text-xl">{person.avatar_emoji}</span>
              <span className="text-body text-text-primary">{person.name}</span>
            </button>
          ))}

          <button
            onClick={() => setShowAdd(true)}
            className="w-full p-3 rounded-button text-left flex items-center gap-3 text-accent hover:bg-accent/5 transition-colors min-h-[44px]"
          >
            <Plus size={20} strokeWidth={1.5} />
            <span className="text-body font-medium">{t('add_person')}</span>
          </button>
        </div>
      </BottomSheet>

      <AddPersonForm open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAddPerson} />
    </>
  )
}
