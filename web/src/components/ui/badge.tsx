import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em]',
  {
    variants: {
      variant: {
        default: 'border-brand bg-brand text-paper',
        outline: 'border-rule bg-transparent text-ink-soft',
        muted: 'border-transparent bg-surface-2 text-muted',
        accent: 'border-accent bg-accent text-paper',
        late: 'border-late bg-late text-paper',
      },
    },
    defaultVariants: { variant: 'outline' },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { badgeVariants }
