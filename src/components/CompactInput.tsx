'use client'

import { useState, useRef, useCallback, DragEvent } from 'react'
import { Plus, X, ArrowUp } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

const MAX_CHARS = 5000
const FLY_DURATION = 400

interface CompactInputProps {
  onSubmit: (data: { text?: string; screenshot?: string }) => void
  isLoading: boolean
  remaining?: number
  total?: number
  /** Enable flying text animation on submit (used in person detail) */
  animateSend?: boolean
}

export default function CompactInput({
  onSubmit,
  isLoading,
  remaining,
  total,
  animateSend = false,
}: CompactInputProps) {
  const { t } = useI18n()
  const [text, setText] = useState('')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [screenshotName, setScreenshotName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [flyingText, setFlyingText] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value.slice(0, MAX_CHARS))
    // Auto-resize
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setScreenshot(e.target?.result as string)
      setScreenshotName(file.name)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const clearInput = () => {
    setText('')
    setScreenshot(null)
    setScreenshotName('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleSubmit = () => {
    if (!text.trim() && !screenshot) return

    const submitData = {
      text: text.trim() || undefined,
      screenshot: screenshot || undefined,
    }

    if (animateSend && text.trim()) {
      // Show flying text, then submit after animation
      setFlyingText(text.trim())
      clearInput()

      setTimeout(() => {
        setFlyingText(null)
        onSubmit(submitData)
      }, FLY_DURATION)
    } else {
      onSubmit(submitData)
      clearInput()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const getUsageColor = () => {
    if (remaining === undefined || total === undefined || total === 0) return 'text-text-tertiary'
    const pct = remaining / total
    if (pct > 0.5) return 'text-success'
    if (pct > 0.25) return 'text-warning'
    return 'text-danger'
  }

  const hasContent = text.trim().length > 0 || screenshot !== null

  return (
    <div className="fixed bottom-[96px] left-0 right-0 z-30 px-section safe-bottom">
      <div className="max-w-2xl mx-auto relative">
        {/* Flying text overlay */}
        {flyingText && (
          <div
            className="absolute bottom-full left-0 right-0 px-[52px] pointer-events-none animate-send-fly"
          >
            <p className="text-body text-text-primary leading-relaxed line-clamp-2">
              {flyingText}
            </p>
          </div>
        )}

        <div
          className={`rounded-input bg-white border shadow-md transition-colors duration-200 ${
            isDragging ? 'border-accent' : 'border-border'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Screenshot preview */}
          {screenshot && (
            <div className="mx-3 mt-3 flex items-center gap-3 p-2 bg-bg-secondary rounded-lg">
              <img
                src={screenshot}
                alt="Preview"
                className="w-10 h-10 object-cover rounded-lg"
              />
              <span className="text-caption text-text-secondary flex-1 truncate">
                {screenshotName}
              </span>
              <button
                onClick={() => {
                  setScreenshot(null)
                  setScreenshotName('')
                }}
                className="p-1.5 rounded-full hover:bg-white transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X size={16} strokeWidth={1.5} className="text-text-tertiary" />
              </button>
            </div>
          )}

          {/* Input row */}
          <div className="flex items-end gap-2 p-2">
            {/* [+] button - opens gallery */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex-shrink-0 w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-bg-secondary transition-colors mb-0.5"
            >
              <Plus size={18} strokeWidth={1.5} className="text-text-tertiary" />
            </button>

            {/* Textarea */}
            <div className="flex-1 flex flex-col gap-1">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={t('placeholder_1')}
                className="w-full bg-transparent text-body text-text-primary resize-none focus:outline-none placeholder:text-text-tertiary py-2 px-1 leading-relaxed"
                style={{ maxHeight: '160px' }}
                disabled={isLoading}
              />
            </div>

            {/* Send button */}
            <button
              onClick={handleSubmit}
              disabled={!hasContent || isLoading}
              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 mb-0.5 ${
                hasContent && !isLoading
                  ? 'bg-accent text-white hover:bg-accent-hover'
                  : 'bg-bg-secondary text-text-tertiary'
              }`}
            >
              <ArrowUp size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Usage counter */}
          {remaining !== undefined && (
            <div className="flex justify-center pb-2">
              <span className={`text-[11px] font-medium ${getUsageColor()}`}>
                {remaining} {t('usage_remaining')}
              </span>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/heic"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileSelect(file)
              e.target.value = ''
            }}
          />
        </div>
      </div>
    </div>
  )
}
