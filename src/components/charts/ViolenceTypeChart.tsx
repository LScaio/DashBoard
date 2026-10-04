import { motion } from 'framer-motion'
import { PieChart as PieIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useDashboard } from '../../context/dashboardStore'
import { VIOLENCE_TYPE_COLOR, VIOLENCE_TYPE_LABEL } from '../../data/labels'
import type { ViolenceType } from '../../types'
import { typeBreakdown, type TypeBreakdown } from '../../utils/analytics'
import { cn, formatNumber } from '../../utils/format'
import { TrendIndicator } from '../dashboard/TrendIndicator'
import { CountUp } from '../ui/CountUp'
import { DataLabel } from '../ui/DataLabel'
import { EmptyState } from '../ui/EmptyState'
import { Panel } from '../ui/Panel'
import { ChartSkeleton } from '../ui/Skeleton'
import { CHART } from './chartTheme'
import { TooltipCard } from './ChartTooltip'

function TypeTooltip({ active, payload }: { active?: boolean; payload?: readonly { payload?: TypeBreakdown }[] }) {
  const p = payload?.[0]?.payload
  if (!active || !p) return null
  return (
    <TooltipCard
      title={VIOLENCE_TYPE_LABEL[p.key]}
      rows={[
        { label: 'Records', value: formatNumber(p.count), color: VIOLENCE_TYPE_COLOR[p.key] },
        { label: 'Share', value: `${p.pct.toFixed(1)}%`, muted: true },
      ]}
      footer="Demo data"
    />
  )
}

export function ViolenceTypeChart() {
  const { records, filters, isUpdating, patchFilters } = useDashboard()
  const [focus, setFocus] = useState<ViolenceType | null>(null)
  const data = useMemo(() => typeBreakdown(records, filters.dateFrom, filters.dateTo), [records, filters.dateFrom, filters.dateTo])
  const maxPct = Math.max(1, ...data.map((d) => d.pct))

  return (
    <Panel
      title="Types of reported violence"
      subtitle="Share of documented records by category"
      icon={<PieIcon className="h-4 w-4" />}
      labels={
        <>
          <DataLabel kind="demo" />
          <DataLabel kind="documented" />
        </>
      }
    >
      {isUpdating ? (
        <ChartSkeleton height={260} />
      ) : !records.length ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="relative mx-auto h-[220px] w-[220px]" role="img" aria-label="Donut chart of violence types">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.filter((d) => d.count > 0)}
                  dataKey="count"
                  nameKey="key"
                  innerRadius={72}
                  outerRadius={102}
                  paddingAngle={1.5}
                  stroke={CHART.surface}
                  strokeWidth={2}
                  animationDuration={900}
                  onMouseEnter={(_, i) => setFocus(data.filter((d) => d.count > 0)[i]?.key ?? null)}
                  onMouseLeave={() => setFocus(null)}
                >
                  {data
                    .filter((d) => d.count > 0)
                    .map((d) => (
                      <Cell
                        key={d.key}
                        fill={VIOLENCE_TYPE_COLOR[d.key]}
                        opacity={focus && focus !== d.key ? 0.35 : 1}
                        style={{ transition: 'opacity 150ms' }}
                      />
                    ))}
                </Pie>
                <Tooltip content={<TypeTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <CountUp value={records.length} className="tabular text-2xl font-semibold text-white" />
              <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-500">records</span>
            </div>
          </div>

          <ul className="space-y-1" aria-label="Violence type breakdown">
            {data.map((d, i) => (
              <li key={d.key}>
                <button
                  type="button"
                  onMouseEnter={() => setFocus(d.key)}
                  onMouseLeave={() => setFocus(null)}
                  onClick={() => patchFilters({ type: filters.type === d.key ? 'all' : d.key })}
                  title={filters.type === d.key ? 'Clear type filter' : `Filter by ${VIOLENCE_TYPE_LABEL[d.key]}`}
                  className={cn(
                    'w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/[0.04]',
                    focus && focus !== d.key && 'opacity-50',
                    filters.type === d.key && 'bg-white/[0.04] ring-1 ring-white/10',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: VIOLENCE_TYPE_COLOR[d.key] }} aria-hidden />
                    <span className="min-w-0 flex-1 truncate text-[13px] text-slate-200">{VIOLENCE_TYPE_LABEL[d.key]}</span>
                    <span className="tabular w-10 text-right text-[13px] font-semibold text-slate-100">{formatNumber(d.count)}</span>
                    <span className="tabular w-12 text-right text-xs text-slate-400">{d.pct.toFixed(1)}%</span>
                    <span className="hidden w-20 justify-end sm:flex">
                      <TrendIndicator trend={d.trend} compact />
                    </span>
                  </div>
                  <div className="ml-[22px] mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.04]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: VIOLENCE_TYPE_COLOR[d.key] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(d.pct / maxPct) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </button>
              </li>
            ))}
            <li className="px-3 pt-2 text-[11px] text-slate-500">
              Trend: second vs first half of selected period. Click a category to filter.
            </li>
          </ul>
        </div>
      )}
    </Panel>
  )
}
