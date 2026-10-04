import { useMemo } from 'react'
import { TYPE_LABEL } from '../../data/labels'
import { useDashboard } from '../../state/dashboardStore'
import { cn, fmt, pct } from '../../utils/format'
import { typeShares } from '../../utils/metrics'
import { Card } from '../ui/Card'
import { DemoTag } from '../ui/DemoTag'

export function TypeTable({ className }: { className?: string }) {
  const { records, filters, patchFilters } = useDashboard()
  const data = useMemo(() => typeShares(records), [records])
  return (
    <Card title="Breakdown by type" className={className} bodyClassName="p-0 pt-3" actions={<DemoTag />}>
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-y border-line text-[10px] uppercase tracking-wider text-ink-3">
            <th className="px-4 py-2 font-semibold">Type</th>
            <th className="px-4 py-2 text-right font-semibold">Incidents</th>
            <th className="px-4 py-2 text-right font-semibold">Share</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr
              key={d.key}
              onClick={() => patchFilters({ type: filters.type === d.key ? 'all' : d.key })}
              className={cn('cursor-pointer border-b border-line/70 hover:bg-primary/[0.06]', filters.type === d.key && 'bg-primary/10')}
            >
              <td className="px-4 py-2.5 text-ink">
                <span className="inline-flex items-center gap-2">
                  <span className={cn('h-1.5 w-1.5 rounded-full', d.key === 'sexual' ? 'bg-alert' : 'bg-primary')} />
                  {TYPE_LABEL[d.key]}
                </span>
              </td>
              <td className="tabular px-4 py-2.5 text-right text-ink">{fmt(d.count)}</td>
              <td className="tabular px-4 py-2.5 text-right text-ink-2">{pct(d.pct)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
