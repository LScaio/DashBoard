import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { VICTIM_LABEL } from '../../data/labels'
import { useDashboard } from '../../state/dashboardStore'
import type { VictimGroup } from '../../types'
import { fmt, pct } from '../../utils/format'
import { groupShares, type Share } from '../../utils/metrics'
import { Card } from '../ui/Card'
import { DemoTag } from '../ui/DemoTag'
import { ChartTooltip } from './chartParts'

const COLOR: Record<VictimGroup, string> = { adult: '#7c83fd', 'under-18': '#a78bfa', older: '#3f4a8a' }

export function GroupBreakdown({ className }: { className?: string }) {
  const { records } = useDashboard()
  const data = useMemo(() => groupShares(records), [records])
  return (
    <Card title="Victim group" subtitle="Share of documented incidents" className={className} actions={<DemoTag />}>
      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[180px_1fr]">
        <div className="relative mx-auto h-[180px] w-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="key"
                innerRadius={56}
                outerRadius={84}
                stroke="#10151f"
                strokeWidth={2}
                animationDuration={600}
              >
                {data.map((d) => (
                  <Cell key={d.key} fill={COLOR[d.key]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  const p = payload?.[0]?.payload as Share<VictimGroup> | undefined
                  return active && p ? (
                    <ChartTooltip
                      rows={[
                        ['Group', VICTIM_LABEL[p.key]],
                        ['Incidents', fmt(p.count)],
                        ['Share', pct(p.pct)],
                      ]}
                    />
                  ) : null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="tabular text-lg font-bold text-white">{fmt(records.length)}</span>
            <span className="text-[10px] uppercase tracking-wider text-ink-3">records</span>
          </div>
        </div>
        <ul className="space-y-2">
          {data.map((d) => (
            <li key={d.key} className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 text-ink-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLOR[d.key] }} aria-hidden />
                {VICTIM_LABEL[d.key]}
              </span>
              <span className="tabular text-ink">
                {fmt(d.count)} <span className="text-ink-3">· {pct(d.pct)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
