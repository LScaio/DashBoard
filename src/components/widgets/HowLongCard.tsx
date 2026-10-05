import { ArrowDown, Hourglass } from 'lucide-react'
import { CONFLICT_START } from '../../data/demoIncidents'
import { calendarDuration, todayISO } from '../../utils/date'
import { Card } from '../ui/Card'
import { CountUp } from '../ui/CountUp'

export function HowLongCard({ className }: { className?: string }) {
  const d = calendarDuration(CONFLICT_START, todayISO())
  return (
    <Card
      title="How long?"
      subtitle="Since full-scale invasion"
      className={className}
      actions={<Hourglass className="h-4 w-4 text-primary-2" />}
    >
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="font-mono text-xs tracking-[0.18em] text-ink-2">24 FEB 2022</p>
        <ArrowDown className="my-2 h-4 w-4 text-ink-3" aria-hidden />
        <p className="tabular text-[44px] font-bold leading-none tracking-tight text-white">
          <CountUp value={d.totalDays} duration={1.6} />
        </p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">days</p>
        <ArrowDown className="my-2 h-4 w-4 text-ink-3" aria-hidden />
        <p className="tabular text-sm font-semibold text-ink">
          {d.years} YEARS · {d.months} MONTHS · {d.days} DAYS
        </p>
        <p className="mt-4 text-[11px] leading-relaxed text-ink-3">
          Elapsed time since 24 February 2022. It does not imply that any specific form of violence occurred continuously over this period.
        </p>
      </div>
    </Card>
  )
}
