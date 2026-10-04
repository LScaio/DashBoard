import { useMemo } from 'react'
import { useDashboard } from '../../state/dashboardStore'
import { cn, fmt } from '../../utils/format'
import { regionStats } from '../../utils/metrics'
import { Badge } from '../ui/Badge'
import { CONFIDENCE_TONE } from '../ui/tones'
import { Card } from '../ui/Card'
import { DemoTag } from '../ui/DemoTag'

export function RegionTable({ className }: { className?: string }) {
  const { records, filters, patchFilters } = useDashboard()
  const stats = useMemo(
    () =>
      regionStats(records)
        .filter((s) => s.count > 0)
        .sort((a, b) => b.count - a.count),
    [records],
  )
  const max = Math.max(1, ...stats.map((s) => s.count))
  return (
    <Card
      title="Documented incidents by region"
      subtitle="Counts depend on population, access and documentation capacity — not a measure of danger"
      className={className}
      bodyClassName="p-0 pt-3"
      actions={<DemoTag />}
    >
      <div className="scroll-thin max-h-[460px] overflow-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-panel">
            <tr className="border-y border-line text-[10px] uppercase tracking-wider text-ink-3">
              <th className="px-4 py-2 font-semibold">Region</th>
              <th className="px-4 py-2 font-semibold">Incidents</th>
              <th className="px-4 py-2 font-semibold">Period</th>
              <th className="px-4 py-2 font-semibold">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr
                key={s.region.id}
                onClick={() => patchFilters({ region: filters.region === s.region.id ? 'all' : s.region.id })}
                className={cn(
                  'cursor-pointer border-b border-line/70 hover:bg-primary/[0.06]',
                  filters.region === s.region.id && 'bg-primary/10',
                )}
              >
                <td className="px-4 py-2 text-ink">{s.region.name}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-14 overflow-hidden rounded bg-white/[0.05]">
                      <div className="h-full rounded bg-primary" style={{ width: `${(s.count / max) * 100}%` }} />
                    </div>
                    <span className="tabular text-ink">{fmt(s.count)}</span>
                  </div>
                </td>
                <td className="tabular whitespace-nowrap px-4 py-2 text-ink-2">
                  {s.firstYear === s.lastYear ? s.firstYear : `${s.firstYear}–${s.lastYear}`}
                </td>
                <td className="px-4 py-2">
                  <Badge tone={CONFIDENCE_TONE[s.confidence]}>{s.confidence}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
