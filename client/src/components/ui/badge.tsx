import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

const variants = {
  neutral: 'bg-muted text-muted-foreground',
  outline: 'border border-border text-foreground',
  accent: 'bg-accent text-accent-foreground',
}

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'neutral', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  )
)
Badge.displayName = 'Badge'
