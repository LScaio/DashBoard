import type { ReactNode } from 'react'

export interface TooltipRow {
  label: string
  value: ReactNode
  color?: string
  muted?: boolean
}

/** Presentational tooltip card used inside Recharts and the map. */
export function TooltipCard({ title, rows, footer }: { title: ReactNode; rows: TooltipRow[]; footer?: ReactNode }) {
  return (
    <div className="min-w-[220px] max-w-[320px] rounded-xl border border-white/10 bg-ink-800/95 p-3 shadow-2xl shadow-black/50 backdrop-blur">
      <p className="mb-2 text-[12.5px] font-semibold text-slate-100">{title}</p>
      <dl className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-6 text-xs">
            <dt className="flex items-center gap-1.5 whitespace-nowrap text-slate-400">
              {r.color && <span className="h-2 w-2 rounded-sm" style={{ background: r.color }} aria-hidden />}
              {r.label}
            </dt>
            <dd className={r.muted ? 'tabular whitespace-nowrap text-slate-400' : 'tabular whitespace-nowrap font-medium text-slate-100'}>
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
      {footer && (
        <p className="mt-2.5 border-t border-white/[0.07] pt-2 font-mono text-[9.5px] uppercase tracking-[0.1em] text-amber-300/80">
          {footer}
        </p>
      )}
    </div>
  )
}
