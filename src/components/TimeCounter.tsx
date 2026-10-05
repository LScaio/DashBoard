import { calendarDuration, todayISO } from '../utils/date'
import { CONFLICT_START } from '../data/demoIncidents'
import { Card } from './Card'
import { CountUp } from './CountUp'

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

export function TimeCounter({ className }: { className?: string }) {
  const d = calendarDuration(CONFLICT_START, todayISO())
  return (
    <Card title="Quanto tempo?" className={className} delay={0.15}>
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="text-xs text-ink-2">Desde 24 de fevereiro de 2022</p>
        <p className="tabular mt-3 bg-gradient-to-r from-lilac to-rose bg-clip-text text-[56px] font-bold leading-none tracking-tight text-transparent">
          <CountUp value={d.totalDays} duration={1.4} />
        </p>
        <p className="mt-1 text-xs font-semibold tracking-[0.3em] text-ink-2">DIAS</p>
        <p className="mt-4 rounded-lg border border-line px-3 py-1.5 text-[13px] font-semibold uppercase tracking-wide text-ink">
          {plural(d.years, 'ano', 'anos')} · {plural(d.months, 'mês', 'meses')} · {plural(d.days, 'dia', 'dias')}
        </p>
        <p className="mt-3 text-[10.5px] text-ink-3">Tempo decorrido desde o início da invasão em larga escala.</p>
      </div>
    </Card>
  )
}
