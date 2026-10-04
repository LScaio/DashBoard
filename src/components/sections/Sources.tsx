import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

/** Instituições citadas apenas como possíveis fontes. Nenhum dado delas é usado no protótipo. */
const SOURCES = [
  { mark: 'ONU', name: 'Organização das Nações Unidas' },
  { mark: 'UN Women', name: 'ONU Mulheres' },
  { mark: 'OHCHR', name: 'Escritório do Alto Comissariado da ONU para os Direitos Humanos' },
  { mark: 'OMS', name: 'Organização Mundial da Saúde (WHO)' },
  { mark: 'OSCE', name: 'Organização para a Segurança e Cooperação na Europa' },
  { mark: 'ONGs', name: 'Organizações humanitárias' },
]

export function Sources() {
  return (
    <section className="relative bg-paper text-paper-ink" aria-labelledby="fontes-titulo">
      <div className="mx-auto max-w-7xl border-t border-paper-ink/10 px-5 py-24 sm:px-8 sm:py-28">
        <div id="fontes-titulo">
          <SectionHeading tone="light" eyebrow="Fontes" title="Quem produz esses dados?" />
        </div>
        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-paper-ink/10 bg-paper-ink/10 md:grid-cols-3 lg:grid-cols-6">
          {SOURCES.map((s, i) => (
            <Reveal key={s.mark} delay={i * 0.06} className="h-full">
              <div className="flex h-full min-h-[150px] flex-col justify-between bg-paper p-6 transition-colors hover:bg-white">
                <span className="font-display text-2xl font-medium tracking-tight text-paper-ink">{s.mark}</span>
                <span className="mt-6 text-xs leading-snug text-paper-ink/55">{s.name}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-6 text-sm text-paper-ink/60">
            <strong className="font-medium text-paper-ink">Fontes de referência para uma futura implementação.</strong> Nenhum dado destas
            instituições é utilizado neste protótipo.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
