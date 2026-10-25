import { useNow } from '../hooks/useNow'
import { calendarDuration, toISODate } from '../utils/date'
import { isoToBR } from '../utils/format'
import { Card } from './Card'
import { CountUp } from './CountUp'

/** Start of the full-scale invasion — also the start of the spreadsheet's 2022+ periods. */
const CONFLICT_START = '2022-02-24'

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

export function TimeCounter({ dataEnd, className }: { dataEnd: string | null; className?: string }) {
  const now = useNow(60_000)
  const d = calendarDuration(CONFLICT_START, toISODate(now))
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
        <p className="mt-3 text-[10.5px] text-ink-3">
          Tempo decorrido desde o início da invasão em larga escala, pela data deste dispositivo.
        </p>
        {dataEnd && (
          <p className="mt-1 text-[10.5px] text-ink-3">
            Os períodos da planilha vão até <span className="tabular text-ink-2">{isoToBR(dataEnd)}</span>.
          </p>
        )}
      </div>
    </Card>
  )
}
