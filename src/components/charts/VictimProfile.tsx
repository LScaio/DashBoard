import { motion } from 'framer-motion'
import { Lock, Users } from 'lucide-react'
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useDashboard } from '../../context/dashboardStore'
import { AGE_GROUP_LABEL, CONTEXT_LABEL } from '../../data/labels'
import { ageBreakdown, civilianBreakdown, contextBreakdown, regionStats } from '../../utils/analytics'
import { formatNumber } from '../../utils/format'
import { DataLabel } from '../ui/DataLabel'
import { EmptyState } from '../ui/EmptyState'
import { Panel } from '../ui/Panel'
import { ChartSkeleton } from '../ui/Skeleton'
import { CHART } from './chartTheme'
import { TooltipCard } from './ChartTooltip'

interface AgePoint {
  label: string
  count: number
  pct: number
}

function AgeTooltip({ active, payload }: { active?: boolean; payload?: readonly { payload?: AgePoint }[] }) {
  const p = payload?.[0]?.payload
  if (!active || !p) return null
  return (
    <TooltipCard
      title={`Age group ${p.label}`}
      rows={[
        { label: 'Records', value: formatNumber(p.count), color: CHART.accent },
        { label: 'Share', value: `${p.pct.toFixed(1)}%`, muted: true },
      ]}
      footer="Demo data"
    />
  )
}

function BarList({ title, items }: { title: string; items: { label: string; count: number; pct: number }[] }) {
  return (
    <div>
      <h4 className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li key={it.label}>
            <div className="flex items-center justify-between gap-2 text-[12.5px]">
              <span className="truncate text-slate-300">{it.label}</span>
              <span className="tabular shrink-0 text-slate-400">
                <span className="font-medium text-slate-100">{formatNumber(it.count)}</span> · {it.pct.toFixed(0)}%
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
              <motion.div
                className="h-full rounded-full bg-blue-500/80"
                initial={{ width: 0 }}
                whileInView={{ width: `${it.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function VictimProfile() {
  const { records, isUpdating } = useDashboard()
  const ages = useMemo(() => ageBreakdown(records).map((a) => ({ label: AGE_GROUP_LABEL[a.key], count: a.count, pct: a.pct })), [records])
  const status = civilianBreakdown(records)
  const contexts = contextBreakdown(records).map((c) => ({ label: CONTEXT_LABEL[c.key], count: c.count, pct: c.pct }))
  const regions = regionStats(records)
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((s) => ({ label: s.region.name, count: s.count, pct: records.length ? (s.count / records.length) * 100 : 0 }))
  const civilian = status.find((s) => s.key === 'civilian')!
  const displaced = status.find((s) => s.key === 'displaced')!

  return (
    <Panel
      title="Victim profile"
      subtitle="Aggregated characteristics — no individual or identifying information"
      icon={<Users className="h-4 w-4" />}
      labels={
        <>
          <DataLabel kind="demo" />
          <DataLabel kind="documented" />
        </>
      }
      actions={
        <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/20 bg-emerald-400/[0.05] px-2 py-1 text-[11px] text-emerald-300/90">
          <Lock className="h-3 w-3" aria-hidden /> Privacy-preserving aggregates
        </span>
      }
    >
      {isUpdating ? (
        <ChartSkeleton height={240} />
      ) : !records.length ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <div>
            <h4 className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">Age group</h4>
            <div className="h-[210px]" role="img" aria-label="Bar chart of records by age group">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ages} margin={{ top: 8, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke={CHART.grid} vertical={false} />
                  <XAxis dataKey="label" interval={0} tick={CHART.tickStyle} axisLine={{ stroke: CHART.axis }} tickLine={false} />
                  <YAxis tick={CHART.tickStyle} axisLine={false} tickLine={false} allowDecimals={false} width={40} />
                  <Tooltip content={<AgeTooltip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
                  <Bar dataKey="count" fill={CHART.accent} radius={[4, 4, 0, 0]} maxBarSize={44} animationDuration={900} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <h4 className="mb-3 mt-6 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">Civilian / displaced</h4>
            <div
              className="flex h-3 gap-[2px] overflow-hidden rounded-full"
              role="img"
              aria-label={`Civilian ${civilian.pct.toFixed(0)}%, displaced ${displaced.pct.toFixed(0)}%`}
            >
              <motion.div
                className="bg-blue-500"
                initial={{ width: 0 }}
                whileInView={{ width: `${civilian.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
              />
              <motion.div
                className="bg-amber-500/80"
                initial={{ width: 0 }}
                whileInView={{ width: `${displaced.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
              />
            </div>
            <dl className="mt-3 space-y-1.5 text-[12.5px]">
              {[
                { label: 'Civilian (resident)', s: civilian, swatch: 'bg-blue-500' },
                { label: 'Displaced', s: displaced, swatch: 'bg-amber-500/80' },
              ].map(({ label, s, swatch }) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <dt className="inline-flex items-center gap-2 text-slate-300">
                    <span className={`h-2 w-2 rounded-sm ${swatch}`} aria-hidden /> {label}
                  </dt>
                  <dd className="tabular text-slate-400">
                    <span className="font-medium text-slate-100">{formatNumber(s.count)}</span> · {s.pct.toFixed(0)}%
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <BarList title="Context of incident" items={contexts} />
            <BarList title="Geographic location (top 5)" items={regions} />
          </div>
        </div>
      )}
      <p className="mt-6 flex items-start gap-2 text-[11.5px] leading-relaxed text-slate-500">
        <Lock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
        This dashboard never displays names, addresses, contact details or any information that could identify survivors. Small groups may
        be suppressed in a production system to prevent re-identification.
      </p>
    </Panel>
  )
}
