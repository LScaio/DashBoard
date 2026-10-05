import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useDashboard } from '../../state/dashboardStore'
import { todayISO } from '../../utils/date'
import { fmt } from '../../utils/format'
import { yearlyCounts } from '../../utils/metrics'
import { Card } from '../ui/Card'
import { DemoTag } from '../ui/DemoTag'
import { ChartTooltip } from './chartParts'
import { CHART_TICK } from './chartTheme'

export function YearlyBars({ className }: { className?: string }) {
  const { records, filters } = useDashboard()
  const data = useMemo(() => yearlyCounts(records, filters), [records, filters])
  const currentYear = Number(todayISO().slice(0, 4))
  return (
    <Card title="Incidents per year" subtitle={`${currentYear} is a partial year`} className={className} actions={<DemoTag />}>
      <div className="h-[240px]" role="img" aria-label="Bar chart of documented incidents per year">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 4, bottom: 0, left: -10 }}>
            <CartesianGrid stroke="#202938" vertical={false} />
            <XAxis dataKey="year" tick={CHART_TICK} tickLine={false} axisLine={{ stroke: '#2b3547' }} />
            <YAxis tick={CHART_TICK} tickLine={false} axisLine={false} width={48} />
            <Tooltip
              cursor={{ fill: 'rgba(124,131,253,0.06)' }}
              content={({ active, payload }) => {
                const p = payload?.[0]?.payload as { year: number; count: number } | undefined
                return active && p ? (
                  <ChartTooltip
                    rows={[
                      ['Year', String(p.year)],
                      ['Incidents', fmt(p.count)],
                    ]}
                  />
                ) : null
              }}
            />
            <Bar
              dataKey="count"
              fill="#7c83fd"
              radius={[4, 4, 0, 0]}
              maxBarSize={56}
              label={{ position: 'top', fill: '#a3acbd', fontSize: 10.5, formatter: (v: unknown) => fmt(Number(v)) }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
