import { EmotionalSignal } from '@/types/analysis'
import Pill from '@/components/ui/Pill'

const signalColors: Array<'blue' | 'purple' | 'pink' | 'orange' | 'green' | 'yellow'> = [
  'blue',
  'purple',
  'pink',
  'orange',
  'green',
  'yellow',
]

interface EmotionalSignalsProps {
  signals: EmotionalSignal[]
}

export default function EmotionalSignals({ signals }: EmotionalSignalsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {signals.map((signal, i) => (
          <Pill
            key={i}
            label={signal.signal}
            emoji={signal.emoji}
            color={signalColors[i % signalColors.length]}
          />
        ))}
      </div>
      <div className="space-y-3">
        {signals.map((signal, i) => (
          <p key={i} className="text-body text-text-secondary">
            <span className="font-medium text-text-primary">{signal.emoji} {signal.signal}:</span>{' '}
            {signal.explanation}
          </p>
        ))}
      </div>
    </div>
  )
}
