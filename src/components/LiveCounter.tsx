import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { INVASION_START_MS } from '../config'
import { calendarDuration, kyivDateISO } from '../utils/date'
import { fmt } from '../utils/format'

/** Current time, re-rendered exactly on each second boundary. */
function useNow(step = 1000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    let timer = 0
    const tick = () => {
      setNow(Date.now())
      timer = window.setTimeout(tick, step - (Date.now() % step) + 5)
    }
    timer = window.setTimeout(tick, step - (Date.now() % step) + 5)
    return () => window.clearTimeout(timer)
  }, [step])
  return now
}

const pad = (n: number) => String(n).padStart(2, '0')
const unit = (n: number, one: string, many: string) => `${fmt(n)} ${n === 1 ? one : many}`

function Block({ value, label, wide = false }: { value: string; label: string; wide?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-end rounded-xl bg-white/10 px-2 py-3 ring-1 ring-white/15 ${wide ? 'col-span-3 sm:col-span-2' : ''}`}
    >
      <span
        className={`tabular font-bold leading-none tracking-tight ${wide ? 'text-[52px] sm:text-[56px]' : 'text-[36px] sm:text-[44px]'}`}
      >
        {value}
      </span>
      <span className="mt-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-white/75">{label}</span>
    </div>
  )
}

/** Real-time elapsed time since the start of the full-scale invasion. */
export function LiveCounter({ className = '' }: { className?: string }) {
  const now = useNow()
  const ms = Math.max(0, now - INVASION_START_MS)
  const days = Math.floor(ms / 86_400_000)
  const hours = Math.floor((ms % 86_400_000) / 3_600_000)
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  const seconds = Math.floor((ms % 60_000) / 1000)
  const cal = calendarDuration('2022-02-24', kyivDateISO(now))

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      aria-labelledby="counter-title"
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--hero-from)] to-[var(--hero-to)] p-5 text-white shadow-lg shadow-black/10 sm:p-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="counter-title" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
            Tempo desde o início da invasão em larga escala
          </h2>
          <p className="mt-1 text-sm text-white/90">24 de fevereiro de 2022</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider ring-1 ring-white/20">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
          Ao vivo
        </span>
      </div>

      <div role="timer" aria-live="off" className="my-5 grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-2.5">
        <Block value={fmt(days)} label={days === 1 ? 'dia' : 'dias'} wide />
        <Block value={pad(hours)} label="horas" />
        <Block value={pad(minutes)} label="minutos" />
        <Block value={pad(seconds)} label="segundos" />
      </div>
      <p className="sr-only">
        {unit(days, 'dia', 'dias')}, {unit(hours, 'hora', 'horas')} e {unit(minutes, 'minuto', 'minutos')} desde 24 de fevereiro de 2022.
      </p>

      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <p className="text-[15px] font-semibold">
          {unit(cal.years, 'ano', 'anos')}, {unit(cal.months, 'mês', 'meses')} e {unit(cal.days, 'dia', 'dias')}
        </p>
        <p className="text-[11px] text-white/70">Contagem a partir de 00h00 de 24/02/2022, horário de Kyiv (UTC+2)</p>
      </div>
    </motion.section>
  )
}
