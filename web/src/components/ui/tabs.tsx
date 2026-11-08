import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  label: string
  className?: string
}

// Small accessible tabs primitive: roving tabindex, arrow/Home/End keys.
// It exists so charts that show two measures do not become two stacked cards.
export function Tabs({ tabs, label, className }: TabsProps) {
  const [active, setActive] = useState(tabs[0]?.id)
  const base = useId()
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    let next = index
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = tabs.length - 1
    const target = tabs[next]
    setActive(target.id)
    refs.current[target.id]?.focus()
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className="mb-4 inline-flex gap-1 rounded-lg border border-rule bg-surface-2 p-1"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => {
              refs.current[tab.id] = node
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`${base}-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
              active === tab.id
                ? 'bg-surface text-ink shadow-sm'
                : 'text-muted hover:text-ink',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${base}-panel-${tab.id}`}
          aria-labelledby={`${base}-tab-${tab.id}`}
          hidden={active !== tab.id}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
