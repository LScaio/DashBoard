import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TYPE_LABEL } from '../../data/labels'
import { useDashboard } from '../../state/dashboardStore'
import { fmt, pct } from '../../utils/format'
import { typeShares, type Share } from '../../utils/metrics'
import type { ViolenceType } from '../../types'
import { Card } from '../ui/Card'
import { DemoTag } from '../ui/DemoTag'
import { ChartTooltip } from './chartParts'
import { CHART_TICK } from './chartTheme'

const SHORT: Record<ViolenceType, string> = {
  sexual: 'Sexual',
  physical: 'Physical',
  psychological: 'Psychological',
  displacement: 'Displacement',
  detention: 'Detention',
  other: 'Other',
}

export function ViolenceTypes({ className, height = 240 }: { className?: string; height?: number }) {
  const { records, filters, patchFilters } = useDashboard()
  const data = useMemo(() => typeShares(records).map((s) => ({ ...s, name: SHORT[s.key] })), [records])

  return (
    <Card
      title="Violence types"
      subtitle="Documented incidents by category · click a bar to filter"
      className={className}
      actions={<DemoTag />}
    >
      <div style={{ height }} role="img" aria-label="Bar chart of documented incidents by violence type">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, bottom: 0, left: 0 }} barCategoryGap="22%">
            <CartesianGrid stroke="#202938" horizontal={false} />
            <XAxis type="number" tick={CHART_TICK} tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ ...CHART_TICK, fill: '#a3acbd' }} tickLine={false} axisLine={false} width={92} />
            <Tooltip
              cursor={{ fill: 'rgba(124,131,253,0.06)' }}
              content={({ active, payload }) => {
                const p = (payload?.[0]?.payload ?? null) as Share<ViolenceType> | null
                return active && p ? (
                  <ChartTooltip
                    rows={[
                      ['Type', TYPE_LABEL[p.key]],
                      ['Incidents', fmt(p.count)],
                      ['Share', pct(p.pct)],
                    ]}
                  />
                ) : null
              }}
            />
            <Bar
              dataKey="count"
              radius={[0, 4, 4, 0]}
              maxBarSize={26}
              animationDuration={600}
              className="cursor-pointer"
              onClick={(d) => {
                const key = (d as unknown as { key: ViolenceType }).key
                patchFilters({ type: filters.type === key ? 'all' : key })
              }}
              label={{ position: 'right', fill: '#a3acbd', fontSize: 10.5, formatter: (v: unknown) => fmt(Number(v)) }}
            >
              {data.map((d) => (
                <Cell
                  key={d.key}
                  fill={d.key === 'sexual' ? '#f05252' : '#7c83fd'}
                  fillOpacity={filters.type === 'all' || filters.type === d.key ? 1 : 0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
