import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

export function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">{label}</legend>
      {children}
    </fieldset>
  )
}

interface SelectProps<T extends string> {
  id: string
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}

export function Select<T extends string>({ id, label, value, options, onChange }: SelectProps<T>) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-white/[0.09] bg-ink-950/70 pl-3 pr-9 text-[13px] text-slate-200 transition-colors hover:border-white/20 focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-ink-900">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
    </div>
  )
}

interface ChipGroupProps<T extends string> {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  ariaLabel: string
}

export function ChipGroup<T extends string>({ value, options, onChange, ariaLabel }: ChipGroupProps<T>) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={
              active
                ? 'rounded-lg border border-blue-400/40 bg-blue-500/15 px-3 py-1.5 text-xs font-medium text-blue-200'
                : 'rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-white/20 hover:text-slate-200'
            }
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
