import { Info } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Area, AreaChart, CartesianGrid, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { freshness } from '../data/derive'
import type { DashboardData, DatasetId } from '../data/types'
import { INVASION_START_MS } from '../config'
import { dayMs, fmt, fmtCompact, fmtDate, fmtMonth, fmtMonthLong } from '../utils/format'
import { Card } from './Card'
import { FreshnessBadge } from './SourceTag'

type TypeId = 'physical' | 'sexual' | 'displacement'

const TYPES: { id: TypeId; label: string; color: string }[] = [
  { id: 'physical', label: 'Física', color: 'var(--phys)' },
  { id: 'sexual', label: 'Sexual', color: 'var(--sex)' },
  { id: 'displacement', label: 'Deslocamento forçado', color: 'var(--disp)' },
]

const X0 = Date.UTC(2021, 11, 1)
const TICK = { fill: 'var(--ink-3)', fontSize: 11 }
const yearTicks = (x1: number) => {
  const out: number[] = []
  for (let y = 2022; Date.UTC(y, 0, 1) <= x1; y++) out.push(Date.UTC(y, 0, 1))
  return out
}

interface Row {
  key: string
  label: string
  value: number
  color: string
}

function TipBox({ title, rows, total, note }: { title: string; rows: Row[]; total?: number; note?: string }) {
  return (
    <div className="min-w-[180px] rounded-lg border border-line bg-card px-3 py-2 text-xs shadow-lg shadow-black/10">
      <p className="mb-1 font-semibold text-ink">{title}</p>
      {rows.map((r) => (
        <div key={r.key} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-ink-2">
            <span className="h-2 w-2 rounded-sm" style={{ background: r.color }} aria-hidden />
            {r.label}
          </span>
          <span className="tabular font-medium text-ink">{fmt(r.value)}</span>
        </div>
      ))}
      {total !== undefined && (
        <div className="mt-1 flex justify-between gap-4 border-t border-line pt-1">
          <span className="text-ink-2">Total</span>
          <span className="tabular font-semibold text-ink">{fmt(total)}</span>
        </div>
      )}
      {note && <p className="mt-1 max-w-[220px] text-[11px] text-ink-3">{note}</p>}
    </div>
  )
}

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} aria-hidden />
      {label}
    </span>
  )
}

interface PanelProps {
  title: string
  unit: string
  keys: ReactNode
  source: ReactNode
  height: number
  children: ReactNode
}

function Panel({ title, unit, keys, source, height, children }: PanelProps) {
  return (
    <figure className="min-w-0">
      <figcaption className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="text-[13px] font-semibold text-ink">
          {title} <span className="font-normal text-ink-3">· {unit}</span>
        </span>
        <span className="flex flex-wrap items-center gap-x-3 text-[11px] text-ink-2">{keys}</span>
      </figcaption>
      <div style={{ height }}>{children}</div>
      <div className="mt-1 text-[11px] text-ink-3">{source}</div>
    </figure>
  )
}

interface TimelinePanelsProps {
  data: DashboardData
  updated: Partial<Record<DatasetId, number>>
  displacementLive: boolean
  className?: string
}

export function TimelinePanels({ data, updated, displacementLive, className = '' }: TimelinePanelsProps) {
  const [visible, setVisible] = useState<Record<TypeId, boolean>>({ physical: true, sexual: true, displacement: true })
  const toggle = (id: TypeId) =>
    setVisible((v) => {
      const next = { ...v, [id]: !v[id] }
      return Object.values(next).some(Boolean) ? next : v // keep at least one panel on
    })

  const { casualties: cas, pgo, displacement: disp } = data
  const [mountedAt] = useState(() => Date.now())
  const x1 = Math.max(mountedAt, dayMs(cas.periodEnd))
  const ticks = yearTicks(x1)
  const xAxis = (show: boolean) => (
    <XAxis
      dataKey="t"
      type="number"
      scale="time"
      domain={[X0, x1]}
      ticks={ticks}
      tickFormatter={(t: number) => String(new Date(t).getUTCFullYear())}
      tick={show ? TICK : false}
      tickLine={false}
      axisLine={{ stroke: 'var(--line)' }}
      height={show ? 22 : 4}
    />
  )
  const invasion = <ReferenceLine x={INVASION_START_MS} stroke="var(--ink-3)" strokeWidth={1} />

  const physical = useMemo(
    () => cas.monthly.map((m) => ({ t: dayMs(m.month), month: m.month, killed: m.killed, injured: m.injured })),
    [cas.monthly],
  )
  const sexual = useMemo(
    () =>
      [...pgo.snapshots]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((s) => ({ t: dayMs(s.date), date: s.date, female: s.female, male: s.male })),
    [pgo.snapshots],
  )
  const displacement = useMemo(
    () => disp.years.map((y) => ({ t: Date.UTC(y.year, 11, 31, 12), year: y.year, refugees: y.refugees, idps: y.idps })),
    [disp.years],
  )

  const lastMonth = physical[physical.length - 1]
  const visibleIds = TYPES.filter((t) => visible[t.id]).map((t) => t.id)
  const lastVisible = visibleIds[visibleIds.length - 1]
  const height = (base: number) => (visibleIds.length === 1 ? base + 110 : visibleIds.length === 2 ? base + 40 : base)

  return (
    <Card
      id="linha-do-tempo"
      title="Linha do tempo por tipo de violência"
      subtitle="Cada tipo tem sua própria escala: as unidades são diferentes e não devem ser somadas. Clique na legenda para mostrar ou ocultar um tipo."
      className={className}
      delay={0.1}
      flash={!!updated['ohchr-civilian-casualties']}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Tipos de violência exibidos">
        {TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={visible[t.id]}
            onClick={() => toggle(t.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
              visible[t.id] ? 'border-line bg-card-2 text-ink' : 'border-dashed border-line text-ink-3 line-through decoration-ink-3/60'
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: visible[t.id] ? t.color : 'var(--men-2)' }} aria-hidden />
            {t.label}
          </button>
        ))}
        <span
          className="inline-flex cursor-help items-center gap-2 rounded-full border border-dashed border-line px-3 py-1.5 text-[12.5px] text-ink-3"
          aria-disabled="true"
          title="Nenhuma das fontes oficiais consultadas publica uma série temporal de violência psicológica ligada ao conflito. A categoria não é desenhada para não exibir números inventados."
        >
          <span className="h-2.5 w-2.5 rounded-full border border-dashed border-ink-3" aria-hidden />
          Psicológica · sem série oficial
          <Info size={13} aria-hidden />
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {visible.physical && (
          <Panel
            title="Física"
            unit="civis mortos e feridos por mês (todas as idades e sexos)"
            height={height(170)}
            keys={
              <>
                <Swatch color="var(--phys)" label="mortos" />
                <Swatch color="var(--phys-2)" label="feridos" />
                <FreshnessBadge kind={freshness(cas.publishedAt)} justUpdated={!!updated['ohchr-civilian-casualties']} />
              </>
            }
            source={
              <>
                ONU · ACNUDH (HRMMU), casos verificados até {fmtDate(cas.periodEnd)}. Faixa destacada: mês incluído na atualização mais
                recente ({fmtMonth(lastMonth.month)}).
              </>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={physical} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                {xAxis(lastVisible === 'physical')}
                <YAxis tick={TICK} tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => fmt(v)} />
                <ReferenceArea
                  x1={dayMs(lastMonth.month) - 15 * 86_400_000}
                  x2={x1}
                  fill="var(--recent)"
                  fillOpacity={0.1}
                  ifOverflow="hidden"
                />
                {invasion}
                <Tooltip
                  cursor={{ stroke: 'var(--ink-3)', strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    const p = payload?.[0]?.payload as (typeof physical)[number] | undefined
                    if (!active || !p) return null
                    return (
                      <TipBox
                        title={fmtMonthLong(p.month)}
                        rows={[
                          { key: 'k', label: 'Mortos', value: p.killed, color: 'var(--phys)' },
                          { key: 'i', label: 'Feridos', value: p.injured, color: 'var(--phys-2)' },
                        ]}
                        total={p.killed + p.injured}
                        note={p.month === '2022-02' ? 'Fevereiro de 2022: apenas de 24 a 28/02.' : undefined}
                      />
                    )
                  }}
                />
                <Area
                  type="linear"
                  dataKey="killed"
                  stackId="p"
                  stroke="none"
                  fill="var(--phys)"
                  fillOpacity={0.95}
                  isAnimationActive={false}
                />
                <Area
                  type="linear"
                  dataKey="injured"
                  stackId="p"
                  stroke="var(--phys)"
                  strokeWidth={1.5}
                  fill="var(--phys-2)"
                  fillOpacity={0.9}
                  activeDot={{ r: 4, fill: 'var(--phys)', stroke: 'var(--card)', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
        )}

        {visible.sexual && (
          <Panel
            title="Sexual"
            unit="fatos registrados contra civis, acumulado desde 2022"
            height={height(130)}
            keys={
              <>
                <Swatch color="var(--sex)" label="vítimas mulheres e meninas" />
                <Swatch color="var(--men)" label="homens e meninos" />
                <FreshnessBadge kind={freshness(sexual[sexual.length - 1].date)} justUpdated={!!updated['pgo-crsv']} />
              </>
            }
            source={
              <>
                Procuradoria-Geral da Ucrânia. Pontos = datas em que o total foi divulgado com divisão por sexo (
                {sexual.map((s) => fmtDate(s.date)).join(', ')}).
              </>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sexual} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                {xAxis(lastVisible === 'sexual')}
                <YAxis
                  tick={TICK}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  tickFormatter={(v: number) => fmt(v)}
                  domain={[0, 'auto']}
                />
                {invasion}
                <Tooltip
                  cursor={{ stroke: 'var(--ink-3)', strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    const p = payload?.[0]?.payload as (typeof sexual)[number] | undefined
                    if (!active || !p) return null
                    return (
                      <TipBox
                        title={`Divulgação de ${fmtDate(p.date)}`}
                        rows={[
                          { key: 'f', label: 'Mulheres e meninas', value: p.female, color: 'var(--sex)' },
                          { key: 'm', label: 'Homens e meninos', value: p.male, color: 'var(--men)' },
                        ]}
                        total={p.female + p.male}
                        note="Total acumulado desde 24/02/2022."
                      />
                    )
                  }}
                />
                <Area
                  type="linear"
                  dataKey="female"
                  stackId="s"
                  stroke="var(--sex)"
                  strokeWidth={2}
                  fill="var(--sex)"
                  fillOpacity={0.85}
                  dot={{ r: 4, fill: 'var(--sex)', stroke: 'var(--card)', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
                <Area
                  type="linear"
                  dataKey="male"
                  stackId="s"
                  stroke="var(--men)"
                  strokeWidth={2}
                  fill="var(--men-2)"
                  fillOpacity={0.9}
                  dot={{ r: 4, fill: 'var(--men)', stroke: 'var(--card)', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
        )}

        {visible.displacement && (
          <Panel
            title="Deslocamento forçado"
            unit="pessoas deslocadas em 31 de dezembro de cada ano"
            height={height(130)}
            keys={
              <>
                <Swatch color="var(--disp)" label="refugiadas fora do país" />
                <Swatch color="var(--disp-2)" label="deslocadas internas" />
                <FreshnessBadge kind={displacementLive ? 'live' : 'historical'} justUpdated={!!updated['unhcr-displacement']} />
              </>
            }
            source={<>ACNUR (agência da ONU para refugiados). 2021 = situação antes da invasão em larga escala.</>}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displacement} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                {xAxis(lastVisible === 'displacement')}
                <YAxis tick={TICK} tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => fmtCompact(v)} />
                {invasion}
                <Tooltip
                  cursor={{ stroke: 'var(--ink-3)', strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    const p = payload?.[0]?.payload as (typeof displacement)[number] | undefined
                    if (!active || !p) return null
                    return (
                      <TipBox
                        title={`31/12/${p.year}`}
                        rows={[
                          { key: 'r', label: 'Refugiadas', value: p.refugees, color: 'var(--disp)' },
                          { key: 'i', label: 'Deslocadas internas', value: p.idps, color: 'var(--disp-2)' },
                        ]}
                        total={p.refugees + p.idps}
                      />
                    )
                  }}
                />
                <Area
                  type="linear"
                  dataKey="refugees"
                  stackId="d"
                  stroke="var(--disp)"
                  strokeWidth={2}
                  fill="var(--disp)"
                  fillOpacity={0.85}
                  dot={{ r: 4, fill: 'var(--disp)', stroke: 'var(--card)', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
                <Area
                  type="linear"
                  dataKey="idps"
                  stackId="d"
                  stroke="var(--disp)"
                  strokeWidth={1.5}
                  fill="var(--disp-2)"
                  fillOpacity={0.9}
                  dot={{ r: 4, fill: 'var(--disp-2)', stroke: 'var(--card)', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
        )}
      </div>

      <p className="mt-4 flex gap-2 rounded-lg bg-card-2 px-3 py-2 text-[11.5px] leading-snug text-ink-3">
        <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
        <span>
          A linha vertical marca 24/02/2022. Violência psicológica não aparece porque nenhuma fonte oficial consultada publica uma série
          temporal dessa categoria; preferimos a ausência a um número inventado. A ONU registra ameaças de violência sexual dentro dos casos
          de violência sexual.
        </span>
      </p>

      <details className="mt-3 text-[12.5px]">
        <summary className="cursor-pointer font-medium text-accent">Ver os dados do gráfico em tabela</summary>
        <DataTables physical={physical} sexual={sexual} displacement={displacement} />
      </details>
    </Card>
  )
}

interface DataTablesProps {
  physical: { month: string; killed: number; injured: number }[]
  sexual: { date: string; female: number; male: number }[]
  displacement: { year: number; refugees: number; idps: number }[]
}

function DataTables({ physical, sexual, displacement }: DataTablesProps) {
  const cls = 'tabular px-2 py-1 text-right'
  return (
    <div className="mt-2 grid gap-4 md:grid-cols-3">
      <div className="max-h-64 overflow-auto rounded-lg border border-line">
        <table className="w-full text-[12px]">
          <caption className="bg-card-2 px-2 py-1 text-left font-semibold text-ink-2">Física — civis por mês</caption>
          <thead className="text-ink-3">
            <tr>
              <th className="px-2 py-1 text-left">Mês</th>
              <th className={cls}>Mortos</th>
              <th className={cls}>Feridos</th>
            </tr>
          </thead>
          <tbody>
            {[...physical].reverse().map((r) => (
              <tr key={r.month} className="border-t border-line text-ink">
                <td className="px-2 py-1">{fmtMonth(r.month)}</td>
                <td className={cls}>{fmt(r.killed)}</td>
                <td className={cls}>{fmt(r.injured)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="max-h-64 overflow-auto rounded-lg border border-line">
        <table className="w-full text-[12px]">
          <caption className="bg-card-2 px-2 py-1 text-left font-semibold text-ink-2">Sexual — acumulado (Procuradoria)</caption>
          <thead className="text-ink-3">
            <tr>
              <th className="px-2 py-1 text-left">Data</th>
              <th className={cls}>Mulheres</th>
              <th className={cls}>Homens</th>
            </tr>
          </thead>
          <tbody>
            {sexual.map((r) => (
              <tr key={r.date} className="border-t border-line text-ink">
                <td className="px-2 py-1">{fmtDate(r.date)}</td>
                <td className={cls}>{fmt(r.female)}</td>
                <td className={cls}>{fmt(r.male)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="max-h-64 overflow-auto rounded-lg border border-line">
        <table className="w-full text-[12px]">
          <caption className="bg-card-2 px-2 py-1 text-left font-semibold text-ink-2">Deslocamento — fim de ano (ACNUR)</caption>
          <thead className="text-ink-3">
            <tr>
              <th className="px-2 py-1 text-left">Ano</th>
              <th className={cls}>Refugiadas</th>
              <th className={cls}>Internas</th>
            </tr>
          </thead>
          <tbody>
            {displacement.map((r) => (
              <tr key={r.year} className="border-t border-line text-ink">
                <td className="px-2 py-1">{r.year}</td>
                <td className={cls}>{fmt(r.refugees)}</td>
                <td className={cls}>{fmt(r.idps)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
