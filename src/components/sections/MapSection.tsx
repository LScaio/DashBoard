import { Info } from 'lucide-react'
import { UkraineHexMap } from '../map/UkraineHexMap'
import { DemoTag } from '../ui/DemoTag'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function MapSection() {
  return (
    <section id="mapas" className="relative">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="04 · Mapas"
              title="Onde essas histórias aparecem?"
              lead="Cada hexágono é uma região da Ucrânia. Passe o mouse (ou toque) para ver quantos registros documentados existem no conjunto demonstrativo e em que período aparecem."
            />
            <Reveal delay={0.15} className="mt-6">
              <DemoTag text="Registros documentados no conjunto demonstrativo" />
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-10 flex gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-lilac-300" aria-hidden />
                <p className="text-sm leading-relaxed text-lilac-100/65">
                  Mais registros não significam, necessariamente, mais violência. Os números documentados refletem também diferenças de
                  população, de acesso ao território, de capacidade de documentação e de possibilidade de denúncia.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <UkraineHexMap />
            <p className="mt-3 text-[11px] text-lilac-100/35">Mapa esquemático — posições aproximadas, sem precisão cartográfica.</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
