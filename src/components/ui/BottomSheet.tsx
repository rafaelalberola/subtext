'use client'

import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[20px] border-t border-border animate-slide-up safe-bottom">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-section pb-4">
            <h3 className="text-subtitle text-text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-full hover:bg-bg-secondary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X size={20} strokeWidth={1.5} className="text-text-secondary" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-section pb-section max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
