import { type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-20 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-sm text-foreground',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'aria-invalid:border-destructive',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'resize-none',
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'
