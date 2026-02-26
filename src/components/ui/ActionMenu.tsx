'use client'

import { useState, useEffect, useRef } from 'react'
import { MoreVertical } from 'lucide-react'

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
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen(!open)
        }}
        className="p-2 rounded-full hover:bg-bg-secondary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <MoreVertical size={20} strokeWidth={1.5} className="text-text-tertiary" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-card shadow-lg border border-border py-1 min-w-[160px] z-40 animate-action-menu-in">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
                item.onClick()
              }}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 text-body transition-colors min-h-[44px] ${
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
      )}
    </div>
  )
}
