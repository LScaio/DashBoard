import { motion } from 'framer-motion'
import { CalendarClock, Hourglass } from 'lucide-react'
import { useDashboard } from '../../context/dashboardStore'
import { DATASET_META } from '../../data/incidents'
import { dateExtent } from '../../utils/analytics'
import { calendarDuration, formatDate, formatDateLong, parseISODate, todayISO } from '../../utils/date'
import { formatNumber } from '../../utils/format'
import { CountUp } from '../ui/CountUp'
import { DataLabel } from '../ui/DataLabel'
import { InfoTip } from '../ui/InfoTip'

function DurationUnit({ value, unit, delay }: { value: number; unit: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col"
    >
      <CountUp
        value={value}
        duration={1.6}
        className="tabular bg-gradient-to-b from-white to-slate-300 bg-clip-text text-[56px] font-semibold leading-none tracking-tighter text-transparent sm:text-[76px] xl:text-[88px]"
      />
      <span className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-300/90">{unit}</span>
    </motion.div>
  )
}

/** Horizontal timeline from conflict start to today with the selected window highlighted. */
function PeriodRail({ from, to, end }: { from: string; to: string; end: string }) {
  const start = parseISODate(DATASET_META.conflictStart).getTime()
  const total = parseISODate(end).getTime() - start
  const pos = (iso: string) => Math.min(100, Math.max(0, ((parseISODate(iso).getTime() - start) / total) * 100))
  const startYear = parseISODate(DATASET_META.conflictStart).getUTCFullYear()
  const endYear = parseISODate(end).getUTCFullYear()
  const years = Array.from({ length: endYear - startYear }, (_, i) => startYear + 1 + i)

  return (
    <div className="mt-8" aria-label={`Selected period ${formatDate(from)} to ${formatDate(to)}`}>
      <div className="relative h-2 rounded-full bg-white/[0.05]">
        <motion.div
          className="absolute inset-y-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.55)]"
          initial={{ left: `${pos(from)}%`, width: 0 }}
          animate={{ left: `${pos(from)}%`, width: `${pos(to) - pos(from)}%` }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
        {years.map((y) => (
          <span
            key={y}
            className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-white/20"
            style={{ left: `${pos(`${y}-01-01`)}%` }}
            aria-hidden
          />
        ))}
      </div>
      <div className="relative mt-2 h-4 font-mono text-[10px] text-slate-500">
        <span className="absolute left-0">24 Feb 2022</span>
        {years.map((y) => {
          const p = pos(`${y}-01-01`)
          return p > 20 && p < 86 ? (
            <span key={y} className="absolute -translate-x-1/2" style={{ left: `${p}%` }}>
              {y}
            </span>
          ) : null
        })}
        <span className="absolute right-0">Today</span>
      </div>
    </div>
  )
}

export function ConflictDuration() {
  const { filters, records } = useDashboard()
  const today = todayISO()
  const reference = filters.dateTo < today ? filters.dateTo : today
  const d = calendarDuration(DATASET_META.conflictStart, reference)
  const extent = dateExtent(records)
  const reportingSpan = extent ? calendarDuration(extent.first, extent.last).totalDays + 1 : 0

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-blue-400/15 bg-gradient-to-br from-[#0d1a33] via-ink-900 to-ink-950 p-6 sm:p-8"
      aria-labelledby="duration-title"
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]"
        aria-hidden
      />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Hourglass className="h-4 w-4 text-blue-300" aria-hidden />
            <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-blue-300/90">Conflict duration</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded border border-emerald-400/25 bg-emerald-400/[0.06] px-1.5 py-[3px] font-mono text-[9.5px] font-medium uppercase tracking-[0.08em] text-emerald-300/90">
            Calendar fact · not a dataset value
          </span>
        </div>

        <h2 id="duration-title" className="mt-3 flex items-center gap-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          How long has the violence persisted?
          <InfoTip
            label="About this counter"
            content="This counter shows the duration of the conflict period up to the selected end date. It does NOT mean that a specific form of violence occurred continuously during every moment of this period."
          />
        </h2>

        <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-5 sm:gap-x-12">
          <DurationUnit value={d.years} unit={d.years === 1 ? 'Year' : 'Years'} delay={0.2} />
          <DurationUnit value={d.months} unit={d.months === 1 ? 'Month' : 'Months'} delay={0.35} />
          <DurationUnit value={d.days} unit={d.days === 1 ? 'Day' : 'Days'} delay={0.5} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mb-1 border-l border-white/10 pl-6 sm:pl-8"
          >
            <p className="tabular text-2xl font-semibold text-slate-200">{formatNumber(d.totalDays)}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">days total</p>
          </motion.div>
        </div>

        <p className="mt-5 text-[15px] font-medium text-slate-200">
          Since the full-scale invasion <span className="text-slate-500">·</span>{' '}
          <span className="text-slate-400">
            {formatDateLong(DATASET_META.conflictStart)} → {formatDateLong(reference)}
          </span>
        </p>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-500">
          The counter represents the duration of the conflict up to the selected date. It does not imply that any specific form of violence
          occurred continuously throughout this period.
        </p>

        <PeriodRail from={filters.dateFrom} to={filters.dateTo} end={today} />

        <div className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-white/[0.07] bg-ink-950/50 p-4 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-6">
          <div className="flex items-center gap-2.5">
            <CalendarClock className="h-4 w-4 text-slate-400" aria-hidden />
            <div>
              <p className="text-[13px] font-medium text-slate-200">Documented reporting period</p>
              <p className="text-[11px] text-slate-500">First and last record in the current selection</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:justify-end">
            {extent ? (
              <>
                <span className="tabular text-sm font-medium text-slate-100">
                  {formatDate(extent.first)} <span className="text-slate-500">→</span> {formatDate(extent.last)}
                </span>
                <span className="tabular text-xs text-slate-400">{formatNumber(reportingSpan)} days covered</span>
              </>
            ) : (
              <span className="text-sm text-slate-500">No records in selection</span>
            )}
            <DataLabel kind="demo" />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
