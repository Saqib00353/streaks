import { type LabelHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-sm font-medium text-foreground', className)}
      {...props}
    />
  )
)
Label.displayName = 'Label'
