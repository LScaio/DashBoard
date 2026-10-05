import { cn } from '../../utils/format'

interface SegmentedProps<T extends string> {
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
  ariaLabel: string
  disabled?: boolean
}

export function Segmented<T extends string>({ options, value, onChange, ariaLabel, disabled }: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('flex rounded-lg border border-line bg-bg p-0.5', disabled && 'opacity-40')}
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={o.id === value}
          disabled={disabled}
          onClick={() => onChange(o.id)}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
            o.id === value ? 'bg-primary/20 text-white' : 'text-ink-3 hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
