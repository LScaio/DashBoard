import { motion } from 'framer-motion'
import { CONFLICT_START } from '../../data/demoData'
import { calendarDuration, formatDateLong, todayISO } from '../../utils/date'
import { CountUp } from '../ui/CountUp'
import { Reveal } from '../ui/Reveal'

function Unit({ value, label, delay }: { value: number; label: string; delay: number }) {
  return (
    <Reveal delay={delay} className="flex flex-col items-center">
      <CountUp
        value={value}
        duration={2.2}
        className="tabular bg-gradient-to-b from-white via-lilac-100 to-lilac-300/70 bg-clip-text font-display text-[88px] font-light leading-none tracking-tighter text-transparent sm:text-[140px] lg:text-[180px]"
      />
      <span className="mt-3 text-xs font-medium uppercase tracking-[0.32em] text-lilac-300 sm:text-sm">{label}</span>
    </Reveal>
  )
}

export function TimeSection() {
  const today = todayISO()
  const d = calendarDuration(CONFLICT_START, today)

  return (
    <section id="tempo" className="grain relative overflow-hidden bg-night-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.18),transparent_65%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-5 py-28 text-center sm:px-8 sm:py-40">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-lilac-300">03 · Quanto tempo?</p>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[32px] font-light leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Quanto tempo uma mulher pode viver em um contexto de conflito?
          </h2>
        </Reveal>

        <Reveal delay={0.2} className="mt-16 flex flex-col items-center gap-3">
          <span className="text-sm font-medium uppercase tracking-[0.28em] text-lilac-100/80">{formatDateLong(CONFLICT_START)}</span>
          <motion.span
            className="block h-14 w-px bg-gradient-to-b from-lilac-300 to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4 }}
            style={{ originY: 0 }}
            aria-hidden
          />
          <span className="text-sm font-medium uppercase tracking-[0.28em] text-lilac-100/80">Hoje</span>
        </Reveal>

        <div className="mt-14 flex flex-wrap items-start justify-center gap-x-10 gap-y-10 sm:gap-x-16">
          <Unit value={d.years} label={d.years === 1 ? 'ano' : 'anos'} delay={0.2} />
          <Unit value={d.months} label={d.months === 1 ? 'mês' : 'meses'} delay={0.4} />
          <Unit value={d.days} label={d.days === 1 ? 'dia' : 'dias'} delay={0.6} />
        </div>

        <Reveal delay={0.8}>
          <p className="mt-12 font-display text-xl font-light italic text-lilac-100/75 sm:text-2xl">
            São <span className="tabular not-italic text-white">{d.totalDays.toLocaleString('pt-BR')}</span> dias desde o início da invasão
            em larga escala.
          </p>
          <p className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-5 text-sm leading-relaxed text-lilac-100/60">
            Este contador representa o tempo desde o início da invasão em larga escala da Ucrânia em 24 de fevereiro de 2022. Ele não
            representa a duração contínua de um episódio específico de violência.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
