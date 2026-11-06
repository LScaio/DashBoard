import { ScanLine } from 'lucide-react'
import { sourcesPageUrl, SOURCES_PAGE } from '../config'
import { pgoSnapshots } from '../data/derive'
import type { DashboardData } from '../data/types'
import { fmtDate } from '../utils/format'
import { QrCode } from './QrCode'

const NOTES = [
  'Todos os números são casos verificados ou registrados oficialmente. A própria ONU afirma que os totais reais são consideravelmente maiores.',
  'A violência sexual é muito subnotificada: medo, estigma e falta de acesso às áreas ocupadas impedem muitos relatos.',
  'ONU e Procuradoria contam coisas diferentes: a ONU documenta casos que entrevistou e verificou; a Procuradoria registra fatos em investigações criminais. Os números não devem ser somados.',
  '“Mulheres e meninas” soma as categorias de mulheres adultas e de meninas (menores de 18 anos) publicadas pela mesma fonte, na mesma data.',
]

/** How to read the numbers (caveats shared by every card). */
export function ReadingNotes({ className = '' }: { className?: string }) {
  return (
    <section aria-labelledby="como-ler" className={`rounded-2xl border border-line bg-card p-4 sm:p-5 ${className}`}>
      <h2 id="como-ler" className="text-[15px] font-semibold text-ink">
        Como ler estes números
      </h2>
      <ul className="mt-3 space-y-2 text-[12.5px] leading-snug text-ink-2">
        {NOTES.map((n) => (
          <li key={n} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
            {n}
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Where the numbers come from + QR code to the sources page. */
export function SourcesBand({ data, lastCheck }: { data: DashboardData; lastCheck: number | null }) {
  const url = sourcesPageUrl()
  const { latest } = pgoSnapshots(data)
  const sources = [
    {
      name: 'ONU · ACNUDH / Missão de Monitoramento (HRMMU)',
      what: 'civis mortos e feridos',
      when: `até ${fmtDate(data.casualties.periodEnd)}`,
    },
    { name: 'ONU · ACNUDH, relatório A/HRC/63/CRP.2', what: 'violência sexual documentada', when: `até ${fmtDate(data.crsv.periodEnd)}` },
    { name: 'Procuradoria-Geral da Ucrânia', what: 'violência sexual em investigação', when: `até ${fmtDate(latest.date)}` },
    { name: 'ACNUR (agência da ONU para refugiados)', what: 'pessoas deslocadas', when: `31/12/${data.displacement.latest.year}` },
  ]

  return (
    <section aria-labelledby="origem" className="grid grid-cols-1 gap-3 lg:grid-cols-12">
      <div className="rounded-2xl border border-line bg-card p-4 sm:p-5 lg:col-span-8">
        <h2 id="origem" className="text-[15px] font-semibold text-ink">
          De onde vêm os dados
        </h2>
        <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {sources.map((s) => (
            <li key={s.name} className="text-[12.5px] leading-snug">
              <span className="font-medium text-ink">{s.name}</span>
              <span className="block text-ink-3">
                {s.what} · {s.when}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11.5px] leading-snug text-ink-3">
          A página verifica novos dados a cada 5 minutos, sem precisar recarregar
          {lastCheck
            ? ` (última verificação às ${new Date(lastCheck).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })})`
            : ''}
          .
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-line bg-card p-4 sm:p-5 lg:col-span-4">
        <a
          href={SOURCES_PAGE}
          className="shrink-0 rounded-lg p-1.5 ring-1 ring-line transition-shadow hover:ring-accent"
          aria-label="Abrir a página de fontes"
        >
          <QrCode value={url} size={112} label="QR Code para a página de fontes e metodologia" />
        </a>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-accent">
            <ScanLine size={14} aria-hidden /> Confira as fontes
          </p>
          <p className="mt-1 text-[12.5px] leading-snug text-ink-2">
            Aponte a câmera do celular para ver instituições, links originais, períodos e metodologia.
          </p>
          <a
            href={SOURCES_PAGE}
            className="mt-1.5 block break-all text-[11px] text-ink-3 underline-offset-2 hover:text-ink hover:underline"
          >
            {url.replace(/^https?:\/\//, '')}
          </a>
        </div>
      </div>
    </section>
  )
}
