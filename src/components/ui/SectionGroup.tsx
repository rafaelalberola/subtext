interface SectionGroupProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export default function SectionGroup({
  title,
  description,
  children,
  className = '',
}: SectionGroupProps) {
  return (
    <div className={`pt-5 flex flex-col gap-4 ${className}`}>
      {title && (
        <div className="flex flex-col gap-1">
          <h3 className="text-caption text-text-tertiary font-medium uppercase tracking-wider">{title}</h3>
          {description && (
            <p className="text-caption text-text-secondary">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
