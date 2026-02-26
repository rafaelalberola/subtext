interface PillProps {
  label: string
  emoji?: string
  color?: 'green' | 'yellow' | 'orange' | 'blue' | 'purple' | 'pink' | 'gray'
  className?: string
}

const colorStyles: Record<string, string> = {
  green: 'border border-emerald-300 text-emerald-700 bg-white',
  yellow: 'border border-amber-300 text-amber-700 bg-white',
  orange: 'border border-orange-300 text-orange-700 bg-white',
  blue: 'border border-blue-300 text-blue-700 bg-white',
  purple: 'border border-purple-300 text-purple-700 bg-white',
  pink: 'border border-pink-300 text-pink-700 bg-white',
  gray: 'border border-border text-text-secondary bg-white',
}

export default function Pill({ label, emoji, color = 'gray', className = '' }: PillProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5
        rounded-full text-caption font-medium
        ${colorStyles[color]}
        ${className}
      `}
    >
      {emoji && <span>{emoji}</span>}
      {label}
    </span>
  )
}

export function ConfidencePill({ confidence }: { confidence: 'very_likely' | 'likely' | 'possible' }) {
  const config = {
    very_likely: { label: 'Very likely', color: 'green' as const },
    likely: { label: 'Likely', color: 'yellow' as const },
    possible: { label: 'Possible', color: 'orange' as const },
  }

  const { label, color } = config[confidence]
  return <Pill label={label} color={color} />
}

export function TonePill({ tone }: { tone: string }) {
  const colorMap: Record<string, PillProps['color']> = {
    Direct: 'blue',
    Warm: 'pink',
    Playful: 'purple',
    Professional: 'gray',
    Cautious: 'yellow',
  }

  return <Pill label={tone} color={colorMap[tone] || 'gray'} />
}
