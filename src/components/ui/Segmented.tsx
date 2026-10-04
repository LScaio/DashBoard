import { motion } from 'framer-motion'
import { useId } from 'react'
import { cn } from '../../utils/format'

interface SegmentedProps<T extends string> {
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
  ariaLabel: string
  className?: string
}

export function Segmented<T extends string>({ options, value, onChange, ariaLabel, className }: SegmentedProps<T>) {
  const layoutId = useId()
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        'scrollbar-thin flex max-w-full gap-0.5 overflow-x-auto rounded-lg border border-white/[0.07] bg-ink-950/60 p-0.5',
        className,
      )}
    >
      {options.map((o) => {
        const active = o.id === value
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className={cn(
              'relative whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400',
              active ? 'text-white' : 'text-slate-400 hover:text-slate-200',
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-md border border-blue-400/30 bg-blue-500/20"
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
