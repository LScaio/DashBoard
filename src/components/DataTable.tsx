import { Download } from 'lucide-react'
import { useState } from 'react'
import { DATA_URL } from '../data/dataset'
import type { DataRow, DataStatus } from '../types'
import { formatValue } from '../utils/format'
import { SourceLink } from './SourceLink'
import { StatusBadge } from './StatusBadge'

const FILTERS: (DataStatus | 'all')[] = ['all', 'Documentado', 'Estimativa', 'Não disponível']
const FILTER_LABEL: Record<DataStatus | 'all', string> = {
  all: 'Todos',
  Documentado: 'Documentados',
  Estimativa: 'Estimativas',
  'Não disponível': 'Não disponíveis',
}

const valueClass = (r: DataRow) =>
  r.status === 'Estimativa' ? 'text-estimate' : r.status === 'Não disponível' ? 'text-ink-3' : 'text-white'

/** Every row of the spreadsheet with its period, status, method, source and note — the table view of all charts. */
export function DataTable({ rows }: { rows: DataRow[] }) {
  const [filter, setFilter] = useState<DataStatus | 'all'>('all')
  const visible = filter === 'all' ? rows : rows.filter((r) => r.status === filter)

  return (
    <section id="dados" className="scroll-mt-4 lg:scroll-mt-28 rounded-2xl border border-line bg-card p-4">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2">Planilha de dados — todos os indicadores</h2>
          <p className="mt-1 text-xs text-ink-3">
            Valores, períodos, métodos e observações exatamente como na planilha. Os links levam aos documentos citados; o painel não
            confere o conteúdo deles.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap items-center gap-2">
          <div
            className="flex max-w-full overflow-x-auto rounded-lg border border-line p-0.5"
            role="radiogroup"
            aria-label="Filtrar por status do dado"
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                role="radio"
                aria-checked={filter === f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs transition-colors ${filter === f ? 'bg-lilac/20 font-medium text-white' : 'text-ink-3 hover:text-ink'}`}
              >
                {FILTER_LABEL[f]}{' '}
                <span className="tabular opacity-70">{f === 'all' ? rows.length : rows.filter((r) => r.status === f).length}</span>
              </button>
            ))}
          </div>
          <a
            href={DATA_URL}
            download="dados.csv"
            className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs text-ink-2 transition-colors hover:text-white"
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            Baixar CSV
          </a>
        </div>
      </header>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[960px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-line text-[10.5px] uppercase tracking-wider text-ink-3">
              <th className="py-2 pr-3 font-semibold">Linha</th>
              <th className="py-2 pr-3 font-semibold">Indicador</th>
              <th className="py-2 pr-3 font-semibold">Período</th>
              <th className="py-2 pr-3 text-right font-semibold">Valor</th>
              <th className="py-2 pr-3 font-semibold">Status</th>
              <th className="py-2 pr-3 font-semibold">Método</th>
              <th className="py-2 pr-3 font-semibold">Fonte</th>
              <th className="py-2 font-semibold">Observações metodológicas</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.line} className="border-b border-line/60 align-top last:border-0 hover:bg-white/[0.02]">
                <td className="tabular py-2 pr-3 text-ink-3">{r.line}</td>
                <td className="max-w-[240px] py-2 pr-3">
                  <span className="block text-[10.5px] text-ink-3">{r.categoria}</span>
                  <span className="text-ink">{r.indicador}</span>
                </td>
                <td className="tabular whitespace-nowrap py-2 pr-3 text-ink-2">{r.periodo}</td>
                <td className={`tabular whitespace-nowrap py-2 pr-3 text-right font-semibold ${valueClass(r)}`}>
                  {formatValue(r)}
                  <span className="block text-[10.5px] font-normal text-ink-3">{r.unidade}</span>
                </td>
                <td className="py-2 pr-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="max-w-[160px] py-2 pr-3 text-ink-2">{r.metodo}</td>
                <td className="max-w-[170px] py-2 pr-3">
                  <SourceLink row={r} />
                </td>
                <td className="max-w-[300px] py-2 leading-snug text-ink-2">{r.observacoes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <ul className="space-y-2 md:hidden">
        {visible.map((r) => (
          <li key={r.line} className="rounded-xl border border-line px-3 py-2.5 text-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10.5px] text-ink-3">
                  {r.categoria} · linha {r.line}
                </p>
                <p className="text-ink">{r.indicador}</p>
              </div>
              <p className={`tabular shrink-0 text-right text-sm font-semibold ${valueClass(r)}`}>{formatValue(r)}</p>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <StatusBadge status={r.status} />
              <span className="tabular text-ink-2">{r.periodo}</span>
            </div>
            <p className="mt-1.5 text-ink-2">
              <span className="text-ink-3">Método:</span> {r.metodo}
            </p>
            <p className="mt-0.5 leading-snug text-ink-2">{r.observacoes}</p>
            <SourceLink row={r} className="mt-1.5 block" />
          </li>
        ))}
      </ul>
    </section>
  )
}
