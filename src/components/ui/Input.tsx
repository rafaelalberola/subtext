'use client'

import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-caption text-text-secondary mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full min-h-[56px] px-4 py-4
            rounded-input bg-bg-secondary
            text-body text-text-primary
            placeholder:text-text-tertiary
            border-2 border-transparent
            focus:border-accent focus:bg-white focus:outline-none
            transition-all duration-200 ease-out
            resize-none
            ${className}
          `}
          {...props}
        />
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
