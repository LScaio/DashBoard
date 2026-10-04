import { Activity } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, Line, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useDashboard } from '../../context/dashboardStore'
import { DATASET_RANGE } from '../../data/incidents'
import { TIMELINE_SERIES } from '../../data/labels'
import type { TimelineSeries } from '../../types'
import { timelineByMonth, type TimelinePoint } from '../../utils/analytics'
import { formatMonthKey, formatMonthKeyShort, monthKey } from '../../utils/date'
import { formatNumber } from '../../utils/format'
import { DataLabel } from '../ui/DataLabel'
import { EmptyState } from '../ui/EmptyState'
import { Panel } from '../ui/Panel'
import { Segmented } from '../ui/Segmented'
import { ChartSkeleton } from '../ui/Skeleton'
import { CHART } from './chartTheme'
import { TooltipCard, type TooltipRow } from './ChartTooltip'

interface TipProps {
  active?: boolean
  payload?: readonly { payload?: TimelinePoint }[]
  series: TimelineSeries
}

function TimelineTooltip({ active, payload, series }: TipProps) {
  const p = payload?.[0]?.payload
  if (!active || !p) return null
  const meta = TIMELINE_SERIES.find((s) => s.id === series)!
  const rows: TooltipRow[] = [{ label: meta.label, value: formatNumber(p[series]), color: CHART.accent }]
  if (series !== 'all') {
    rows.push({ label: 'All incidents', value: formatNumber(p.all), color: CHART.context })
    rows.push({ label: 'Share of month', value: p.all ? `${((p[series] / p.all) * 100).toFixed(0)}%` : '—', muted: true })
  }
  return <TooltipCard title={formatMonthKey(p.month)} rows={rows} footer="Demo data · documented cases only" />
}

export function TimelineChart() {
  const { records, filters, isUpdating } = useDashboard()
  const [series, setSeries] = useState<TimelineSeries>('all')
  const data = useMemo(() => timelineByMonth(records, filters.dateFrom, filters.dateTo), [records, filters.dateFrom, filters.dateTo])

  // The last three months of the dataset are subject to reporting lag.
  const lastKey = monthKey(DATASET_RANGE.last)
  const lagIdx = data.findIndex((d) => d.month === lastKey)
  const lagStart = lagIdx >= 2 ? data[lagIdx - 2].month : null
  // Shade through the end of the chart: months after the last record are incomplete too.
  const lagEnd = lagIdx >= 0 ? data[data.length - 1].month : null

  const total = data.reduce((s, d) => s + d[series], 0)
  const peak = data.reduce((best, d) => (d[series] > (best?.[series] ?? -1) ? d : best), data[0] as TimelinePoint | undefined)
  const selected = TIMELINE_SERIES.find((s) => s.id === series)!

  return (
    <Panel
      title="Violence over time"
      subtitle="Monthly incident reports in the selected period"
      icon={<Activity className="h-4 w-4" />}
      labels={
        <>
          <DataLabel kind="illustrative" />
          <DataLabel kind="documented" />
        </>
      }
      actions={
        <Segmented
          ariaLabel="Timeline series"
          value={series}
          onChange={setSeries}
          options={TIMELINE_SERIES.map((s) => ({ id: s.id, label: s.label }))}
        />
      }
    >
      <div className="mb-4 flex flex-wrap items-end gap-x-8 gap-y-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{selected.label}</p>
          <p className="tabular mt-1 text-2xl font-semibold text-white">{formatNumber(total)}</p>
        </div>
        {peak && peak[series] > 0 && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Highest month in dataset</p>
            <p className="tabular mt-1 text-sm font-medium text-slate-200">
              {formatMonthKey(peak.month)} · {formatNumber(peak[series])} records
            </p>
          </div>
        )}
        <div className="ml-auto flex items-center gap-4 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded bg-blue-500" aria-hidden /> {selected.label}
          </span>
          {series !== 'all' && (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-0 w-4 border-t border-dashed border-slate-500" aria-hidden /> All incidents
            </span>
          )}
          {lagStart && lagEnd && (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-3 rounded-sm bg-amber-400/15 ring-1 ring-amber-400/30" aria-hidden /> Reporting lag
            </span>
          )}
        </div>
      </div>

      {isUpdating ? (
        <ChartSkeleton height={320} />
      ) : !records.length ? (
        <EmptyState />
      ) : (
        <div className="h-[320px] w-full" role="img" aria-label={`Line chart of monthly ${selected.label.toLowerCase()} records`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <defs>
                <linearGradient id="timeline-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.accent} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={CHART.grid} vertical={false} />
              {lagStart && lagEnd && (
                <ReferenceArea
                  x1={lagStart}
                  x2={lagEnd}
                  fill="#f5a524"
                  fillOpacity={0.06}
                  stroke="#f5a524"
                  strokeOpacity={0.2}
                  strokeDasharray="3 3"
                />
              )}
              <XAxis
                dataKey="month"
                tickFormatter={formatMonthKeyShort}
                tick={CHART.tickStyle}
                axisLine={{ stroke: CHART.axis }}
                tickLine={false}
                minTickGap={28}
              />
              <YAxis
                tick={CHART.tickStyle}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={44}
                label={{
                  value: 'Incident reports',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 18,
                  style: { fill: CHART.tick, fontSize: 10.5 },
                }}
              />
              <Tooltip
                content={<TimelineTooltip series={series} />}
                cursor={{ stroke: 'rgba(148,163,184,0.35)', strokeDasharray: '3 3' }}
              />
              {series !== 'all' && (
                <Line
                  type="monotone"
                  dataKey="all"
                  stroke={CHART.context}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={false}
                  isAnimationActive
                />
              )}
              <Area
                key={series}
                type="monotone"
                dataKey={series}
                stroke={CHART.accent}
                strokeWidth={2}
                fill="url(#timeline-fill)"
                activeDot={{ r: 5, stroke: CHART.surface, strokeWidth: 2, fill: CHART.accentSoft }}
                animationDuration={1100}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      <p className="mt-3 text-[11.5px] leading-relaxed text-slate-500">
        Changes over time reflect documented records, which depend on access, reporting capacity and verification timelines — not only on
        the incidence of violence. The shaded area marks recent months where records are typically incomplete.
      </p>
    </Panel>
  )
}
