import { EmotionalSignal } from '@/types/analysis'

interface EmotionalSignalsProps {
  signals: EmotionalSignal[]
}

export default function EmotionalSignals({ signals }: EmotionalSignalsProps) {
  return (
    <div className="flex flex-col gap-3">
      {signals.map((signal, i) => (
        <p key={i} className="text-body text-text-secondary">
          <span className="font-medium text-text-primary">{signal.emoji} {signal.signal}:</span>{' '}
          {signal.explanation}
        </p>
      ))}
    </div>
  )
}
