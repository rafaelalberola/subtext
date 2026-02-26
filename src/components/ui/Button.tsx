'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-hover active:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed',
  secondary:
    'bg-white text-text-primary border border-border hover:bg-bg-secondary active:bg-bg-secondary',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary active:bg-bg-secondary',
  danger:
    'bg-danger text-white hover:bg-danger-hover active:bg-danger-hover disabled:opacity-40 disabled:cursor-not-allowed',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', fullWidth = false, className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2
          h-11 px-6 rounded-button
          text-body font-medium
          transition-all duration-200 ease-out
          min-h-[44px]
          ${variantStyles[variant]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
