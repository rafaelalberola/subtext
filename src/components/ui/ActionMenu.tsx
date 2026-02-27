'use client'

import { useState } from 'react'
import { MoreVertical } from 'lucide-react'
import BottomSheet from '@/components/ui/BottomSheet'

interface ActionMenuItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
}

interface ActionMenuProps {
  items: ActionMenuItem[]
}

export default function ActionMenu({ items }: ActionMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        className="p-2 rounded-full hover:bg-bg-secondary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <MoreVertical size={20} strokeWidth={1.5} className="text-text-tertiary" />
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-1">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
                item.onClick()
              }}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 text-body rounded-card transition-colors min-h-[44px] ${
                item.variant === 'danger'
                  ? 'text-danger hover:bg-danger-bg'
                  : 'text-text-primary hover:bg-bg-secondary'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  )
}
