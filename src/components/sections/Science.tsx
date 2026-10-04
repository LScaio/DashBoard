import { motion } from 'framer-motion'
import { Atom, BarChart3, Sparkles } from 'lucide-react'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const ROLES = ['pesquisadoras', 'cientistas', 'engenheiras', 'jornalistas', 'médicas', 'analistas', 'ativistas', 'líderes']

const PILLARS = [
  {
    title: 'Ciência',
    Icon: Atom,
    text: 'Pesquisadoras, organizações e instituições produzem conhecimento para compreender fenômenos sociais complexos — com método, revisão e responsabilidade.',
  },
  {
    title: 'Tecnologia',
    Icon: BarChart3,
    text: 'Dados, mapas e ferramentas digitais permitem visualizar padrões que seriam difíceis de perceber olhando cada caso isoladamente.',
  },
]

export function Science() {
  return (
    <section id="ciencia" className="relative bg-paper text-paper-ink">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          tone="light"
          eyebrow="06 · Ciência"
          title="E onde entra a ciência?"
          lead="Compreender a violência contra mulheres em zonas de conflito exige conhecimento. E esse conhecimento também é produzido por mulheres."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PILLARS.map(({ title, Icon, text }, i) => (
            <Reveal key={title} delay={i * 0.12}>
              <article className="flex h-full flex-col rounded-[28px] border border-paper-ink/[0.08] bg-white p-8 shadow-[0_20px_60px_-30px_rgba(76,58,154,0.35)] sm:p-10">
                <Icon className="h-7 w-7 text-violet" strokeWidth={1.4} aria-hidden />
                <h3 className="mt-10 text-xs font-semibold uppercase tracking-[0.28em] text-violet">{title}</h3>
                <p className="mt-4 text-[17px] leading-relaxed text-paper-ink/75">{text}</p>
              </article>
            </Reveal>
          ))}

          <Reveal delay={0.24}>
            <article className="relative flex h-full flex-col overflow-hidden rounded-[28px] bg-gradient-to-br from-night-800 via-night-700 to-[#3b2a7a] p-8 text-white sm:p-10">
              <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-lilac-300/25 blur-3xl" aria-hidden />
              <Sparkles className="relative h-7 w-7 text-lilac-200" strokeWidth={1.4} aria-hidden />
              <h3 className="relative mt-10 text-xs font-semibold uppercase tracking-[0.28em] text-lilac-200">Mulheres</h3>
              <p className="relative mt-4 text-[17px] leading-relaxed text-lilac-100/85">Mulheres não são apenas objeto de estudo. São:</p>
              <ul className="relative mt-5 flex flex-wrap gap-2">
                {ROLES.map((role, i) => (
                  <motion.li
                    key={role}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.07 }}
                    className="rounded-full border border-lilac-200/25 bg-white/[0.06] px-3.5 py-1.5 font-display text-[15px] italic text-white"
                  >
                    {role}
                  </motion.li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-20 max-w-4xl">
          <p className="font-display text-3xl font-light leading-snug sm:text-[40px]">
            O objetivo deste projeto é lembrar que mulheres também estão{' '}
            <span className="italic text-violet">na produção do conhecimento</span> — e não apenas nos números que ele analisa.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
