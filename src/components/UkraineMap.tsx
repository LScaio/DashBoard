import { useState } from 'react'
import mapData from '../data/ukraine-map.json'
import { freshness, pgoSnapshots } from '../data/derive'
import type { DashboardData, DatasetId } from '../data/types'
import { fmt, fmtDate, pct } from '../utils/format'
import { Card } from './Card'
import { SourceTag } from './SourceTag'

interface MapRegion {
  iso: string
  name: string
  d: string
  lx: number
  ly: number
}
const MAP = mapData as { width: number; height: number; outline: string; regions: MapRegion[] }

/** Class breaks for the purple scale; class 0 = no record in this announcement. */
const BREAKS = [1, 10, 25, 50, 100] as const
const LEGEND = ['1–9', '10–24', '25–49', '50–99', '100 ou mais']
const classOf = (n: number) => (n <= 0 ? 0 : BREAKS.filter((b) => n >= b).length)
/** Labels on the two most intense classes need light text in the light theme, dark text in the dark theme. */
const labelFill = (k: number) => (k >= 3 ? 'var(--map-label-light)' : 'var(--map-label-dark)')
const labelFillDark = (k: number) => (k >= 4 ? 'var(--map-label-dark)' : 'var(--map-label-light)')

interface UkraineMapProps {
  data: DashboardData
  updated: Partial<Record<DatasetId, number>>
  className?: string
  dark: boolean
}

export function UkraineMap({ data, updated, className = '', dark }: UkraineMapProps) {
  const { latest, mapped } = pgoSnapshots(data)
  const counts = mapped.regions ?? {}
  const ohchrRegions = new Set(data.crsv.residentialRegions.iso)
  const [hovered, setHovered] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const [view, setView] = useState<'map' | 'table'>('map')
  const active = hovered ?? pinned

  const ranked = MAP.regions
    .map((r) => ({ ...r, count: counts[r.iso] ?? 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'pt-BR'))
  const withRecords = ranked.filter((r) => r.count > 0)
  const rankOf = (iso: string) => withRecords.findIndex((r) => r.iso === iso) + 1
  const activeRegion = ranked.find((r) => r.iso === active)
  // Draw the highlighted region last so its outline sits on top.
  const drawOrder = active ? [...MAP.regions.filter((r) => r.iso !== active), ...MAP.regions.filter((r) => r.iso === active)] : MAP.regions

  return (
    <Card
      id="mapa"
      title="Onde a violência sexual contra civis foi registrada"
      subtitle={
        <>
          Fatos de violência sexual relacionada ao conflito em investigação criminal, por região onde ocorreram — {fmt(mapped.total)} fatos
          registrados até {fmtDate(mapped.date)}
        </>
      }
      flash={!!updated['pgo-crsv']}
      aside={
        <div className="flex rounded-lg border border-line p-0.5 text-xs" role="tablist" aria-label="Forma de visualização">
          {(['map', 'table'] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={`rounded-md px-2.5 py-1 transition-colors ${view === v ? 'bg-accent-soft font-semibold text-ink' : 'text-ink-3 hover:text-ink'}`}
            >
              {v === 'map' ? 'Mapa' : 'Tabela'}
            </button>
          ))}
        </div>
      }
      footer={
        <SourceTag
          source="Procuradoria-Geral da Ucrânia (via imprensa ucraniana)"
          period={`posição em ${fmtDate(mapped.date)}`}
          anchor="pgo-crsv"
          kind={freshness(mapped.date)}
          justUpdated={!!updated['pgo-crsv']}
        />
      }
      className={className}
    >
      {view === 'map' ? (
        <div className="flex flex-col gap-4">
          <div className="relative min-w-0">
            <svg
              viewBox={`0 0 ${MAP.width} ${MAP.height}`}
              className="h-auto w-full"
              role="group"
              aria-label={`Mapa da Ucrânia por regiões. ${withRecords.length} regiões com registros. Use Tab para percorrer as regiões.`}
              onMouseLeave={() => setHovered(null)}
            >
              <path d={MAP.outline} fill="none" stroke="var(--line)" strokeWidth={6} strokeLinejoin="round" aria-hidden />
              {drawOrder.map((r) => {
                const n = counts[r.iso] ?? 0
                const k = classOf(n)
                const isActive = r.iso === active
                return (
                  <path
                    key={r.iso}
                    d={r.d}
                    fill={`var(--map-${k})`}
                    stroke={isActive ? 'var(--ink)' : 'var(--map-stroke)'}
                    strokeWidth={isActive ? 2.5 : 1.2}
                    strokeLinejoin="round"
                    tabIndex={0}
                    role="button"
                    aria-pressed={pinned === r.iso}
                    aria-label={`${r.name}: ${n ? `${fmt(n)} ${n === 1 ? 'fato registrado' : 'fatos registrados'}` : 'nenhum fato registrado nesta divulgação'}`}
                    className="cursor-pointer outline-none transition-[stroke-width] duration-100 focus-visible:stroke-[var(--accent)]"
                    onMouseEnter={() => setHovered(r.iso)}
                    onFocus={() => setHovered(r.iso)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setPinned((p) => (p === r.iso ? null : r.iso))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setPinned((p) => (p === r.iso ? null : r.iso))
                      }
                    }}
                  />
                )
              })}
              {MAP.regions.map((r) => {
                const n = counts[r.iso] ?? 0
                if (!n) return null
                const k = classOf(n)
                return (
                  <text
                    key={`l-${r.iso}`}
                    x={r.lx}
                    y={r.ly + 7}
                    textAnchor="middle"
                    fontSize={n >= 10 ? 22 : 18}
                    fontWeight={700}
                    fill={dark ? labelFillDark(k) : labelFill(k)}
                    className="pointer-events-none select-none"
                    aria-hidden
                  >
                    {fmt(n)}
                  </text>
                )
              })}
            </svg>
            {activeRegion && <MapTip region={activeRegion} total={mapped.total} />}
            <Legend />
          </div>

          <aside className="grid gap-x-6 gap-y-3 rounded-xl bg-card-2 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]" aria-live="polite">
            <div className="flex flex-col gap-3">
              {activeRegion ? (
                <RegionDetail
                  name={activeRegion.name}
                  count={activeRegion.count}
                  total={mapped.total}
                  rank={rankOf(activeRegion.iso)}
                  ranked={withRecords.length}
                  ohchr={ohchrRegions.has(activeRegion.iso)}
                  pinned={pinned === activeRegion.iso}
                />
              ) : (
                <Summary top={withRecords.slice(0, 4)} total={mapped.total} regions={withRecords.length} />
              )}
            </div>
            <div className="flex flex-col justify-between gap-3 border-t border-line pt-3 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <p className="text-[12px] leading-snug text-ink-2">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-3">Total nacional mais recente</span>
                <strong className="text-[22px] font-bold leading-tight text-ink">{fmt(latest.total)} fatos</strong>
                <span className="block">
                  em {fmtDate(latest.date)} ({fmt(latest.female)} vítimas mulheres e meninas). A Procuradoria não publicou a distribuição
                  completa por região depois de {fmtDate(mapped.date)}; por isso o mapa mostra aquela data.
                </span>
              </p>
              <p className="text-[11.5px] leading-snug text-ink-3">
                Não inclui violência sexual contra prisioneiros de guerra, registrada separadamente. Subnotificação: os números são mínimos.
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <RegionTable rows={ranked} total={mapped.total} ohchr={ohchrRegions} />
      )}
    </Card>
  )
}

function MapTip({ region, total }: { region: MapRegion & { count: number }; total: number }) {
  const left = Math.min(88, Math.max(12, (region.lx / MAP.width) * 100))
  const top = (region.ly / MAP.height) * 100
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+18px)] whitespace-nowrap rounded-lg border border-line bg-card px-3 py-2 text-xs shadow-lg shadow-black/15"
      style={{ left: `${left}%`, top: `${top}%` }}
      aria-hidden
    >
      <p className="font-semibold text-ink">{region.name}</p>
      <p className="text-ink-2">
        {region.count ? (
          <>
            <strong className="tabular font-semibold text-ink">{fmt(region.count)}</strong> {region.count === 1 ? 'fato' : 'fatos'} ·{' '}
            {pct(region.count, total)} do total
          </>
        ) : (
          'nenhum fato nesta divulgação'
        )}
      </p>
    </div>
  )
}

function Legend() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-ink-3" aria-label="Legenda do mapa">
      <span className="font-semibold text-ink-2">Fatos registrados</span>
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-5 rounded-sm ring-1 ring-line" style={{ background: 'var(--map-0)' }} aria-hidden />
        nenhum nesta divulgação
      </span>
      <span className="flex items-center gap-1">
        {LEGEND.map((l, i) => (
          <span key={l} className="flex flex-col items-center gap-1">
            <span className="h-3 w-12 first:rounded-l-sm last:rounded-r-sm" style={{ background: `var(--map-${i + 1})` }} aria-hidden />
            <span className="tabular whitespace-nowrap">{l}</span>
          </span>
        ))}
      </span>
    </div>
  )
}

function Summary({ top, total, regions }: { top: { iso: string; name: string; count: number }[]; total: number; regions: number }) {
  return (
    <>
      <p className="text-[12.5px] leading-snug text-ink-2">
        {regions} regiões têm ao menos um fato registrado; todas tiveram parte do território ocupada por forças russas desde 2022 (a
        Crimeia, desde 2014).
      </p>
      <ol className="space-y-1.5">
        {top.map((r, i) => (
          <li key={r.iso} className="flex items-baseline justify-between gap-2 text-[12.5px]">
            <span className="text-ink">
              <span className="tabular mr-1.5 text-ink-3">{i + 1}.</span>
              {r.name}
            </span>
            <span className="tabular text-ink-2">
              <strong className="font-semibold text-ink">{fmt(r.count)}</strong> · {pct(r.count, total)}
            </span>
          </li>
        ))}
      </ol>
      <p className="text-[11.5px] text-ink-3">Passe o mouse, toque ou use Tab sobre uma região para ver os detalhes.</p>
    </>
  )
}

interface RegionDetailProps {
  name: string
  count: number
  total: number
  rank: number
  ranked: number
  ohchr: boolean
  pinned: boolean
}

function RegionDetail({ name, count, total, rank, ranked, ohchr, pinned }: RegionDetailProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-ink">{name}</h3>
        {pinned && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10.5px] font-semibold text-ink-2">fixada</span>}
      </div>
      {count ? (
        <>
          <p className="text-[34px] font-bold leading-none text-ink">{fmt(count)}</p>
          <p className="text-[12.5px] text-ink-2">
            {count === 1 ? 'fato registrado' : 'fatos registrados'} · {pct(count, total)} do total
            <br />
            {rank}º lugar entre {ranked} regiões com registros
          </p>
        </>
      ) : (
        <p className="text-[12.5px] text-ink-2">Nenhum fato registrado nesta divulgação da Procuradoria.</p>
      )}
      <p className="flex gap-2 text-[12px] leading-snug text-ink-2">
        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${ohchr ? 'bg-sex' : 'bg-men-2'}`} aria-hidden />
        {ohchr
          ? 'A ONU também documentou violência sexual contra civis fora de detenção nesta região.'
          : 'A ONU não lista esta região entre as que tiveram violência sexual contra civis fora de detenção.'}
      </p>
    </>
  )
}

function RegionTable({ rows, total, ohchr }: { rows: { iso: string; name: string; count: number }[]; total: number; ohchr: Set<string> }) {
  return (
    <div className="max-h-[520px] overflow-auto rounded-xl border border-line">
      <table className="w-full text-left text-[13px]">
        <caption className="sr-only">Fatos registrados por região</caption>
        <thead className="sticky top-0 bg-card-2 text-[11.5px] uppercase tracking-wide text-ink-3">
          <tr>
            <th scope="col" className="px-3 py-2 font-semibold">
              Região
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">
              Fatos
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">
              % do total
            </th>
            <th scope="col" className="px-3 py-2 font-semibold">
              ONU (fora de detenção)
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.iso} className="border-t border-line">
              <th scope="row" className="px-3 py-1.5 font-medium text-ink">
                {r.name}
              </th>
              <td className="tabular px-3 py-1.5 text-right text-ink">{r.count ? fmt(r.count) : '–'}</td>
              <td className="tabular px-3 py-1.5 text-right text-ink-2">{r.count ? pct(r.count, total) : '–'}</td>
              <td className="px-3 py-1.5 text-ink-2">{ohchr.has(r.iso) ? 'sim' : '–'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
