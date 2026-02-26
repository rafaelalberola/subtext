'use client'

import { useState } from 'react'
import { Copy, ChevronDown, ChevronUp } from 'lucide-react'
import { SuggestedResponse } from '@/types/analysis'
import { TonePill } from '@/components/ui/Pill'
import { useToast } from '@/components/ui/Toast'

interface SuggestedResponsesProps {
  responses: SuggestedResponse[]
}

export default function SuggestedResponses({ responses }: SuggestedResponsesProps) {
  return (
    <div className="space-y-3">
      {responses.map((response, i) => (
        <ResponseCard key={i} response={response} />
      ))}
    </div>
  )
}

function ResponseCard({ response }: { response: SuggestedResponse }) {
  const [expanded, setExpanded] = useState(false)
  const { showToast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response.message)
      showToast('Copied!')
    } catch {
      showToast('Could not copy')
    }
  }

  return (
    <div className="border border-border rounded-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <TonePill tone={response.tone} />
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-caption text-text-tertiary hover:text-accent transition-colors min-h-[44px] px-2"
        >
          <Copy size={14} strokeWidth={1.5} />
          Copy
        </button>
      </div>

      <p className="text-body text-text-primary">{response.message}</p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-caption text-text-tertiary hover:text-text-secondary transition-colors"
      >
        {expanded ? (
          <>
            <ChevronUp size={14} strokeWidth={1.5} />
            Less
          </>
        ) : (
          <>
            <ChevronDown size={14} strokeWidth={1.5} />
            Why this tone?
          </>
        )}
      </button>

      {expanded && (
        <p className="text-caption text-text-secondary animate-fade-in">
          {response.why}
        </p>
      )}
    </div>
  )
}
