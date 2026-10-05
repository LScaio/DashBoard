import { ArrowDownRight, ArrowUpRight, CalendarRange, FileText, MapPinned, ShieldAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TOTAL_REGIONS } from '../../data/demoIncidents'
import { useDashboard } from '../../state/dashboardStore'
import { computeKpis } from '../../utils/metrics'
import { cn, pct, signedPct } from '../../utils/format'
import { CountUp } from '../ui/CountUp'
import { DemoTag } from '../ui/DemoTag'

interface KpiProps {
  label: string
  value: ReactNode
  detail: ReactNode
  icon: ReactNode
  accent: string
  index: number
}

function Kpi({ label, value, detail, icon, accent, index }: KpiProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="relative overflow-hidden rounded-xl border border-line bg-panel p-4 transition-colors hover:border-line-2"
    >
      <div className={cn('absolute inset-x-0 top-0 h-[2px]', accent)} aria-hidden />
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[10.5px] font-semibold uppercase leading-snug tracking-[0.12em] text-ink-2">{label}</h3>
        <div className="flex shrink-0 items-center gap-2">
          <DemoTag />
          <span className="text-ink-3">{icon}</span>
        </div>
      </div>
      <div className="tabular mt-3 text-[32px] font-bold leading-none tracking-tight text-white">{value}</div>
      <div className="mt-3 text-xs text-ink-3">{detail}</div>
    </motion.article>
  )
}

export function KpiRow() {
  const { allRecords, records, filters } = useDashboard()
  const k = computeKpis(allRecords, records, filters)
  const up = (k.change ?? 0) >= 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Kpi
        index={0}
        label="Documented incidents"
        accent="bg-primary"
        icon={<FileText className="h-4 w-4" />}
        value={<CountUp value={k.total} />}
        detail={
          k.change === null ? (
            'No previous period in dataset'
          ) : (
            <span className="flex items-center gap-1">
              <span className={cn('inline-flex items-center font-semibold', up ? 'text-[#f58b8b]' : 'text-[#6ee79a]')}>
                {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {signedPct(k.change)}
              </span>
              vs previous 12 months
            </span>
          )
        }
      />
      <Kpi
        index={1}
        label="Conflict-related sexual violence"
        accent="bg-alert"
        icon={<ShieldAlert className="h-4 w-4 text-alert" />}
        value={<CountUp value={k.sexual} />}
        detail={
          <span>
            <span className="font-semibold text-ink">{pct(k.sexualShare)}</span> of documented incidents
          </span>
        }
      />
      <Kpi
        index={2}
        label="Affected regions"
        accent="bg-primary-2"
        icon={<MapPinned className="h-4 w-4" />}
        value={<CountUp value={k.regions} />}
        detail={`regions represented (of ${TOTAL_REGIONS})`}
      />
      <Kpi
        index={3}
        label="Reporting period"
        accent="bg-ok"
        icon={<CalendarRange className="h-4 w-4" />}
        value={k.firstYear ? (k.firstYear === k.lastYear ? k.firstYear : `${k.firstYear} → ${k.lastYear}`) : '—'}
        detail={k.firstYear ? `${k.spanLabel} of records` : 'No records'}
      />
    </div>
  )
}
