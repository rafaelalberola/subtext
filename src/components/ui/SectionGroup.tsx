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
    <div className={`pt-5 space-y-4 ${className}`}>
      {title && (
        <div>
          <h3 className="text-caption text-text-tertiary font-medium uppercase tracking-wider">{title}</h3>
          {description && (
            <p className="text-caption text-text-secondary mt-1">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
