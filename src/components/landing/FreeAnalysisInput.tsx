'use client'

import { useState, useEffect, useRef, useCallback, useMemo, DragEvent } from 'react'
import { Camera, X, Sparkles } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

const MAX_CHARS = 2000
const TYPING_SPEED = 45
const PAUSE_AFTER_TYPED = 2500

interface FreeAnalysisInputProps {
  onSubmit: (data: { text?: string; screenshot?: string; honeypot?: string }) => void
  isLoading: boolean
  error?: string | null
}

export default function FreeAnalysisInput({ onSubmit, isLoading, error }: FreeAnalysisInputProps) {
  const { t } = useI18n()
  const [text, setText] = useState('')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [screenshotName, setScreenshotName] = useState<string>('')
  const [typedPlaceholder, setTypedPlaceholder] = useState('')
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const placeholders = useMemo(() => [
    t('placeholder_1'),
    t('placeholder_2'),
    t('placeholder_3'),
    t('placeholder_4'),
  ], [t])

  // Typewriter effect
  useEffect(() => {
    if (text.length > 0) {
      setTypedPlaceholder('')
      return
    }

    const target = placeholders[placeholderIdx]
    let i = 0
    setTypedPlaceholder('')

    const typeTimer = setInterval(() => {
      i++
      if (i <= target.length) {
        setTypedPlaceholder(target.slice(0, i))
      } else {
        clearInterval(typeTimer)
      }
    }, TYPING_SPEED)

    const nextTimer = setTimeout(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length)
    }, target.length * TYPING_SPEED + PAUSE_AFTER_TYPED)

    return () => {
      clearInterval(typeTimer)
      clearTimeout(nextTimer)
    }
  }, [placeholderIdx, text.length > 0, placeholders])

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value.slice(0, MAX_CHARS))
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

  const handleSubmit = () => {
    if (!text.trim() && !screenshot) return
    onSubmit({
      text: text.trim() || undefined,
      screenshot: screenshot || undefined,
      honeypot: honeypot || undefined,
    })
  }

  const charPercent = (text.length / MAX_CHARS) * 100
  const showCharCount = charPercent >= 80
  const hasContent = text.trim().length > 0 || screenshot !== null

  return (
    <div className="flex flex-col gap-3 w-full max-w-xl mx-auto">
      <div
        className={`
          rounded-input bg-white border overflow-hidden
          transition-all duration-200 shadow-md
          ${isDragging ? 'border-accent' : 'border-border focus-within:border-text-tertiary'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Textarea area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            rows={4}
            className="w-full px-5 pt-4 pb-2 bg-transparent text-body text-text-primary text-left resize-none focus:outline-none relative z-10"
            disabled={isLoading}
          />
          {/* Typewriter placeholder */}
          {text.length === 0 && typedPlaceholder && (
            <div
              className="absolute top-4 left-5 right-5 pointer-events-none text-body text-text-tertiary text-left z-0"
              aria-hidden="true"
            >
              {typedPlaceholder}
              <span className="inline-block w-[2px] h-[1em] bg-text-tertiary/40 ml-[1px] align-text-bottom animate-blink" />
            </div>
          )}
        </div>

        {/* Screenshot preview */}
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
          <div className="flex items-center gap-2">
            {showCharCount && (
              <span className={`text-caption ${charPercent >= 100 ? 'text-accent font-medium' : 'text-text-tertiary'}`}>
                {text.length.toLocaleString()}/{MAX_CHARS.toLocaleString()}
              </span>
            )}
          </div>

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
            {isLoading ? t('analyzing') : t('free_cta_button')}
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

        {/* Honeypot field (hidden from real users) */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
      </div>

      {/* Error message */}
      {error === 'free_analysis_error_duplicate' ? (
        <p className="text-caption text-danger text-center">
          {t('free_analysis_error_duplicate')}{' '}
          <a href="/app" className="underline">{t('free_analysis_error_duplicate_link')}</a>
        </p>
      ) : error ? (
        <p className="text-caption text-danger text-center">
          {error.startsWith('free_analysis_error_') ? t(error) : error}
        </p>
      ) : null}

      {/* Subtitle */}
      <p className="text-caption text-text-tertiary text-center">
        {t('free_cta_subtitle')}
      </p>
    </div>
  )
}
