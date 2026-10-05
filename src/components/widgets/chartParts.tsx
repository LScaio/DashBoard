import type { ReactNode } from 'react'

/** Compact tooltip used by every chart and the map. */
export function ChartTooltip({ rows, title }: { rows: [string, ReactNode][]; title?: string }) {
  return (
    <div className="min-w-[170px] rounded-lg border border-line-2 bg-[#0d121b]/95 px-3 py-2.5 shadow-xl shadow-black/50 backdrop-blur">
      {title && <p className="mb-1.5 text-[13px] font-semibold text-white">{title}</p>}
      <dl className="space-y-1">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-4">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-ink-3">{k}</dt>
            <dd className="tabular text-xs font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-1.5 border-t border-line pt-1.5 font-mono text-[9px] uppercase tracking-wider text-warn/80">Demo data</p>
    </div>
  )
}
