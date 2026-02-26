interface DateSeparatorProps {
  label: string
}

export default function DateSeparator({ label }: DateSeparatorProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[11px] text-text-tertiary uppercase tracking-wider bg-bg-secondary rounded-full px-3 py-1">
        {label}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}
