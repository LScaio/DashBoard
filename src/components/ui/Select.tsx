import { ChevronDown } from 'lucide-react'

interface SelectProps<T extends string | number> {
  id: string
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  className?: string
  hideLabel?: boolean
}

export function Select<T extends string | number>({ id, label, value, options, onChange, className, hideLabel }: SelectProps<T>) {
  return (
    <div className={className}>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-3'}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={String(value)}
          onChange={(e) => {
            const raw = e.target.value
            onChange((typeof value === 'number' ? Number(raw) : raw) as T)
          }}
          className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-line bg-panel-2 pl-3 pr-8 text-[13px] text-ink transition-colors hover:border-line-2 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {options.map((o) => (
            <option key={String(o.value)} value={String(o.value)} className="bg-panel">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-3" aria-hidden />
      </div>
    </div>
  )
}
