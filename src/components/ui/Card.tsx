import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number
  animated?: boolean
}

export default function Card({
  delay = 0,
  animated = false,
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-bg-surface rounded-card p-section border border-border
        ${animated ? 'opacity-0 animate-fade-in-up' : ''}
        ${className}
      `}
      style={animated ? { animationDelay: `${delay}ms`, animationFillMode: 'forwards' } : undefined}
      {...props}
    >
      {children}
    </div>
  )
}
