'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Check, AlertCircle, Info } from 'lucide-react'

type ToastVariant = 'success' | 'error' | 'info'

interface ToastState {
  message: string
  visible: boolean
  variant: ToastVariant
}

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

const variantStyles: Record<ToastVariant, { bg: string; Icon: typeof Check }> = {
  success: { bg: 'bg-text-primary', Icon: Check },
  error: { bg: 'bg-danger', Icon: AlertCircle },
  info: { bg: 'bg-info', Icon: Info },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false, variant: 'success' })

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    setToast({ message, visible: true, variant })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }, [])

  const { bg, Icon } = variantStyles[toast.variant]

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <div className="fixed bottom-24 inset-x-0 z-50 flex justify-center pointer-events-none animate-toast-in">
          <div className={`flex items-center gap-2 ${bg} text-white px-5 py-3 rounded-full shadow-md text-body pointer-events-auto`}>
            <Icon size={18} strokeWidth={2} />
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}
