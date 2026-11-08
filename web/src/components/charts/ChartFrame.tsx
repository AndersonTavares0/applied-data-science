import type { ReactNode } from 'react'
import type { ChartCopy } from '../../content/types'
import { cn } from '../../lib/utils'

interface ChartFrameProps {
  copy: ChartCopy
  sourceLabel: string
  children: ReactNode
  className?: string
  footnote?: ReactNode
  id?: string
}

// One data plate: claim, definition, the mark, and the source note. The
// accessible description is the chart, not a caption invented by the browser.
export function ChartFrame({
  copy,
  sourceLabel,
  children,
  className,
  footnote,
  id,
}: ChartFrameProps) {
  return (
    <figure
      id={id}
      className={cn(
        'plate my-8 rounded-xl border border-rule bg-surface p-5 shadow-plate sm:p-6',
        className,
      )}
    >
      <figcaption>
        <h3 className="font-display text-xl font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-[1.35rem]">
          {copy.title}
        </h3>
        <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted">{copy.subtitle}</p>
      </figcaption>
      <div className="mt-5 min-w-0" role="img" aria-label={copy.description}>
        {children}
      </div>
      {footnote ? (
        <div className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-xs leading-relaxed text-ink-soft">
          {footnote}
        </div>
      ) : null}
      <p className="mt-4 border-t border-rule pt-3 text-xs leading-relaxed text-muted">
        <span className="mr-1.5 font-mono text-[10px] uppercase tracking-[0.08em]">
          {sourceLabel}
        </span>
        {copy.note}
      </p>
    </figure>
  )
}
