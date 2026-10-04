import { DEMO_DATA } from '../../data/demoData'
import { share } from '../../utils/stats'
import { TypesChart } from '../charts/TypesChart'
import { YearlyChart } from '../charts/YearlyChart'
import { CountUp } from '../ui/CountUp'
import { DemoTag } from '../ui/DemoTag'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

function BigStat({
  value,
  suffix,
  label,
  note,
  delay,
}: {
  value: number | string
  suffix?: string
  label: string
  note: string
  delay: number
}) {
  return (
    <Reveal delay={delay} className="border-t border-lilac-300/20 pt-6">
      <p
        className={`font-display font-light leading-none tracking-tight text-white ${typeof value === 'number' ? 'text-6xl sm:text-7xl' : 'text-[44px] sm:text-5xl xl:text-[52px]'}`}
      >
        {typeof value === 'number' ? <CountUp value={value} duration={1.8} className="tabular" /> : value}
        {suffix && <span className="text-lilac-300">{suffix}</span>}
      </p>
      <p className="mt-4 text-base font-medium text-lilac-100">{label}</p>
      <p className="mt-1 text-sm text-lilac-100/45">{note}</p>
    </Reveal>
  )
}

export function DataSection() {
  const adults = Math.round(share(DEMO_DATA, (r) => r.victimGroup === 'adulta'))
  const regions = new Set(DEMO_DATA.map((r) => r.region)).size

  return (
    <section id="dados" className="relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-40 h-[480px] w-[480px] rounded-full bg-violet/10 blur-[140px]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          eyebrow="02 · Dados"
          title="Quando transformamos histórias em dados"
          lead="Um dado é uma forma de organizar a memória. Contar, agrupar e comparar ajuda a perceber o que uma história isolada não mostra."
        />
        <Reveal delay={0.1} className="mt-6">
          <DemoTag />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <BigStat value={DEMO_DATA.length} label="Registros demonstrativos" note="Conjunto fictício criado para o protótipo" delay={0} />
          <BigStat value={adults} suffix="%" label="Mulheres adultas" note="Entre os registros demonstrativos" delay={0.1} />
          <BigStat value={regions} label="Regiões representadas" note="Das 26 regiões no mapa" delay={0.2} />
          <BigStat value="2022 → 2026" label="Período analisado" note="Desde a invasão em larga escala" delay={0.3} />
        </div>

        <div className="mt-28 grid grid-cols-1 gap-16 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <h3 className="font-display text-3xl font-light text-white sm:text-4xl">A violência ao longo do tempo</h3>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-lilac-100/60">
                Quantos registros aparecem a cada ano? Escolha uma categoria e passe o mouse sobre a linha.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-8">
              <YearlyChart />
            </Reveal>
          </div>

          <div>
            <Reveal>
              <h3 className="font-display text-3xl font-light text-white sm:text-4xl">Nem toda violência é visível.</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-lilac-100/60">
                Violência não significa apenas agressão física. Muitas formas deixam marcas que não aparecem — e por isso são mais difíceis
                de registrar.
              </p>
            </Reveal>
            <div className="mt-10">
              <TypesChart />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
