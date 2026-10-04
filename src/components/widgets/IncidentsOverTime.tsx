import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TYPE_LABEL } from '../../data/labels'
import { useDashboard } from '../../state/dashboardStore'
import { formatMonthKey } from '../../utils/date'
import { fmt } from '../../utils/format'
import { monthlySeries, type ChartSeries, type MonthPoint } from '../../utils/metrics'
import { Card } from '../ui/Card'
import { DemoTag } from '../ui/DemoTag'
import { Segmented } from '../ui/Segmented'
import { ChartTooltip } from './chartParts'
import { CHART_TICK } from './chartTheme'

const SERIES: { id: ChartSeries; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'sexual', label: 'Sexual' },
  { id: 'physical', label: 'Physical' },
  { id: 'psychological', label: 'Psychological' },
]

export function IncidentsOverTime({ className, height = 280 }: { className?: string; height?: number }) {
  const { records, filters } = useDashboard()
  const [series, setSeries] = useState<ChartSeries>('all')
  const typeLocked = filters.type !== 'all'
  const effective: ChartSeries = typeLocked ? 'all' : series
  const data = useMemo(() => monthlySeries(records, filters, effective), [records, filters, effective])
  const typeName = typeLocked
    ? TYPE_LABEL[filters.type as Exclude<typeof filters.type, 'all'>]
    : effective === 'all'
      ? 'All types'
      : TYPE_LABEL[effective]

  return (
    <Card
      title="Documented incidents over time"
      subtitle={typeLocked ? `Filtered by type: ${typeName}` : 'Monthly records in the selected period'}
      className={className}
      actions={
        <>
          <Segmented ariaLabel="Incident type" options={SERIES} value={effective} onChange={setSeries} disabled={typeLocked} />
          <DemoTag label="Illustrative dataset" />
        </>
      }
    >
      <div style={{ height }} role="img" aria-label="Line chart of documented incidents per month">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -6 }}>
            <defs>
              <linearGradient id="iot-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c83fd" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#7c83fd" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#202938" vertical={false} />
            <XAxis
              dataKey="month"
              tick={CHART_TICK}
              tickLine={false}
              axisLine={{ stroke: '#2b3547' }}
              ticks={data.filter((d) => d.month.endsWith('-01') || d === data[0]).map((d) => d.month)}
              tickFormatter={(m: string) => m.slice(0, 4)}
            />
            <YAxis
              tick={CHART_TICK}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={52}
              label={{
                value: 'Documented incidents',
                angle: -90,
                position: 'insideLeft',
                offset: 12,
                style: { fill: '#6b7588', fontSize: 10.5 },
              }}
            />
            <Tooltip
              cursor={{ stroke: '#6b7588', strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                const p = (payload?.[0]?.payload ?? null) as MonthPoint | null
                return active && p ? (
                  <ChartTooltip
                    rows={[
                      ['Month', formatMonthKey(p.month)],
                      ['Incidents', fmt(p.count)],
                      ['Type', typeName],
                    ]}
                  />
                ) : null
              }}
            />
            <Area
              key={effective}
              type="monotone"
              dataKey="count"
              stroke="#7c83fd"
              strokeWidth={2}
              fill="url(#iot-fill)"
              activeDot={{ r: 4, fill: '#a78bfa', stroke: '#10151f', strokeWidth: 2 }}
              animationDuration={700}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
