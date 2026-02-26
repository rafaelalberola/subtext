'use client'

import { useState, useEffect, useRef, useCallback, DragEvent } from 'react'
import { Camera, X, Sparkles } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

const MAX_CHARS = 5000

interface ConversationInputProps {
  onSubmit: (data: { text?: string; screenshot?: string }) => void
  isLoading: boolean
}

export default function ConversationInput({ onSubmit, isLoading }: ConversationInputProps) {
  const { t } = useI18n()
  const [text, setText] = useState('')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [screenshotName, setScreenshotName] = useState<string>('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [placeholderVisible, setPlaceholderVisible] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const placeholders = [
    t('placeholder_1'),
    t('placeholder_2'),
    t('placeholder_3'),
    t('placeholder_4'),
  ]

  // Rotate placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderVisible(false)
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
        setPlaceholderVisible(true)
      }, 200)
    }, 4000)
    return () => clearInterval(interval)
  }, [placeholders.length])

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

  const handleSubmit = () => {
    if (!text.trim() && !screenshot) return
    onSubmit({
      text: text.trim() || undefined,
      screenshot: screenshot || undefined,
    })
  }

  const charPercent = (text.length / MAX_CHARS) * 100
  const showCharCount = charPercent >= 80
  const hasContent = text.trim().length > 0 || screenshot !== null

  return (
    <div
      className={`
        rounded-input bg-white border overflow-hidden
        transition-all duration-200
        ${isDragging ? 'border-accent' : 'border-border focus-within:border-text-tertiary'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Textarea area */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          rows={4}
          className="w-full px-5 pt-4 pb-2 bg-transparent text-body text-text-primary resize-none focus:outline-none"
          disabled={isLoading}
        />
        {/* Custom placeholder with fade animation */}
        {!text && (
          <div
            className={`
              absolute top-4 left-5 right-5 pointer-events-none
              text-body text-text-tertiary
              transition-opacity duration-200
              ${placeholderVisible ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {placeholders[placeholderIndex]}
          </div>
        )}
      </div>

      {/* Screenshot preview (inside container) */}
      {screenshot && (
        <div className="mx-4 mb-2 flex items-center gap-3 p-2 bg-bg-secondary rounded-lg">
          <img
            src={screenshot}
            alt="Screenshot preview"
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

      {/* Bottom toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-border/50">
        {/* Left: camera/upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-full hover:bg-bg-secondary transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          disabled={isLoading}
        >
          <Camera size={18} strokeWidth={1.5} className="text-text-tertiary" />
        </button>

        {/* Center: character count */}
        {showCharCount && (
          <span className={`text-caption ${charPercent >= 100 ? 'text-accent font-medium' : 'text-text-tertiary'}`}>
            {text.length.toLocaleString()}/{MAX_CHARS.toLocaleString()}
          </span>
        )}

        {/* Right: submit pill */}
        <button
          onClick={handleSubmit}
          disabled={!hasContent || isLoading}
          className={`
            flex items-center gap-1.5 px-4 py-2 rounded-full
            text-caption font-medium transition-all duration-200
            ${hasContent && !isLoading
              ? 'bg-accent text-white hover:bg-accent-hover'
              : 'bg-bg-secondary text-text-tertiary cursor-not-allowed'
            }
          `}
        >
          <Sparkles size={14} strokeWidth={2} />
          {isLoading ? t('analyzing') : t('analyze_button')}
        </button>
      </div>

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
  )
}
