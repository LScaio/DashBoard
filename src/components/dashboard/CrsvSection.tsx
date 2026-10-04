import { ShieldAlert } from 'lucide-react'
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useDashboard } from '../../context/dashboardStore'
import { dateExtent, regionStats, timelineByMonth } from '../../utils/analytics'
import { formatDate, formatMonthKey, formatMonthKeyShort } from '../../utils/date'
import { formatNumber } from '../../utils/format'
import { CHART } from '../charts/chartTheme'
import { TooltipCard } from '../charts/ChartTooltip'
import { CountUp } from '../ui/CountUp'
import { DataLabel } from '../ui/DataLabel'
import { Panel } from '../ui/Panel'
import { ChartSkeleton } from '../ui/Skeleton'

interface Point {
  month: string
  sexual: number
}

function CrsvTooltip({ active, payload }: { active?: boolean; payload?: readonly { payload?: Point }[] }) {
  const p = payload?.[0]?.payload
  if (!active || !p) return null
  return (
    <TooltipCard
      title={formatMonthKey(p.month)}
      rows={[{ label: 'Documented reports', value: formatNumber(p.sexual) }]}
      footer="Demo data · lower bound"
    />
  )
}

function Metric({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-ink-950/40 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <div className="mt-2 text-xl font-semibold text-slate-100">{children}</div>
    </div>
  )
}

export function CrsvSection() {
  const { records, filters, isUpdating } = useDashboard()
  const crsv = useMemo(() => records.filter((r) => r.type === 'sexual'), [records])
  const series = useMemo(
    () => timelineByMonth(crsv, filters.dateFrom, filters.dateTo).map(({ month, sexual }) => ({ month, sexual })),
    [crsv, filters.dateFrom, filters.dateTo],
  )
  const extent = dateExtent(crsv)
  const regions = regionStats(crsv).filter((s) => s.count > 0).length
  const verified = crsv.filter((r) => r.verification === 'verified' || r.verification === 'corroborated').length

  return (
    <Panel
      tone="subdued"
      title="Conflict-Related Sexual Violence"
      subtitle="Documented reports only — figures are a lower bound"
      icon={<ShieldAlert className="h-4 w-4 text-slate-300" />}
      labels={
        <>
          <DataLabel kind="demo" />
          <DataLabel kind="documented" />
          <DataLabel kind="not-official" />
        </>
      }
      className="border-slate-400/10"
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Documented reports">
          <CountUp value={crsv.length} className="tabular" />
        </Metric>
        <Metric label="Reporting period">
          <span className="tabular block text-[14px] font-medium leading-snug">
            {extent ? (
              <>
                {formatDate(extent.first)}
                <span className="text-slate-500"> → </span>
                {formatDate(extent.last)}
              </>
            ) : (
              '—'
            )}
          </span>
        </Metric>
        <Metric label="Regions affected">
          <CountUp value={regions} className="tabular" />
        </Metric>
        <Metric label="Cases with verified sources">
          <CountUp value={verified} className="tabular" />
          <span className="tabular ml-2 text-xs font-normal text-slate-500">
            {crsv.length ? `${((verified / crsv.length) * 100).toFixed(0)}%` : ''}
          </span>
        </Metric>
      </div>

      <div className="mt-5">
        {isUpdating ? (
          <ChartSkeleton height={180} />
        ) : (
          <div className="h-[180px]" role="img" aria-label="Monthly documented reports of conflict-related sexual violence">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonthKeyShort}
                  tick={CHART.tickStyle}
                  axisLine={{ stroke: CHART.axis }}
                  tickLine={false}
                  minTickGap={28}
                />
                <YAxis tick={CHART.tickStyle} axisLine={false} tickLine={false} allowDecimals={false} width={40} />
                <Tooltip content={<CrsvTooltip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
                <Bar dataKey="sexual" fill="#94a3b8" radius={[3, 3, 0, 0]} maxBarSize={14} animationDuration={900} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <p className="mt-4 border-l-2 border-slate-500/40 pl-3 text-[12.5px] leading-relaxed text-slate-400">
        Conflict-related sexual violence is often severely underreported. Documented cases should not be interpreted as representing the
        full scale of the phenomenon.
      </p>
    </Panel>
  )
}
