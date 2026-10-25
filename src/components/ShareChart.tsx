import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { findRow, latestRow, numberOf, totalFromNote } from '../data/dataset'
import type { DataRow } from '../types'
import { fmt, formatValue, pct } from '../utils/format'
import { Card } from './Card'
import { StatusBadge } from './StatusBadge'

/**
 * Indicators that give a number of women AND the total it is part of.
 * Without `periodo`, the most recent row that has a total is used.
 * Without `totalIndicador`, the total is read from the row's "Observações" ("Parte das 5.385 mortes…").
 */
const ITEMS: { indicador: string; label: string; periodo?: string; totalIndicador?: string }[] = [
  { indicador: 'Civis mortas - mulheres', periodo: '14/04/2014–31/12/2021', label: 'Civis mortos', totalIndicador: 'Civis mortos - total' },
  { indicador: 'Mortes por minas/explosivos - mulheres', label: 'Mortes por minas e explosivos' },
  { indicador: 'Feridas por minas/explosivos - mulheres', label: 'Feridos por minas e explosivos' },
  { indicador: 'Detentas torturadas ou maltratadas - mulheres', label: 'Pessoas detidas submetidas a tortura ou maus-tratos' },
  { indicador: 'Vítimas de violência sexual em detenções - mulheres', label: 'Violência sexual em detenções' },
  { indicador: 'Civis mortas - mulheres', periodo: '01/02/2022–31/07/2022', label: 'Civis mortos' },
  { indicador: 'Civis feridas - mulheres', label: 'Civis feridos' },
  { indicador: 'Execuções sumárias de civis - mulheres', label: 'Execuções sumárias de civis' },
  { indicador: 'Civis detentas mortas sob custódia russa', label: 'Civis detidos mortos sob custódia russa' },
  { indicador: 'Vítimas de CRSV atribuídas a autoridades russas - mulheres', label: 'Violência sexual atribuída a autoridades russas' },
  {
    indicador: 'Vítimas de CRSV atribuídas a autoridades ucranianas - mulheres',
    label: 'Violência sexual atribuída a autoridades ucranianas',
  },
]

interface Share {
  key: string
  label: string
  row: DataRow
  total: number
  totalApprox: boolean
  /** Share of women, in %; equal bounds unless the value is a range */
  min: number
  max: number
  estimate: boolean
}

function totalFor(row: DataRow, rows: DataRow[], totalIndicador?: string): { value: number; approx: boolean } | null {
  if (totalIndicador) {
    const t = findRow(rows, totalIndicador, row.periodo)
    const n = numberOf(t)
    return t && n ? { value: n, approx: t.status === 'Estimativa' } : null
  }
  const n = totalFromNote(row.observacoes)
  return n ? { value: n, approx: /cerca|aproximad/i.test(row.observacoes) } : null
}

function buildShares(rows: DataRow[]): Share[] {
  const out: Share[] = []
  for (const item of ITEMS) {
    const candidates = item.periodo ? [findRow(rows, item.indicador, item.periodo)] : [latestRow(rows, item.indicador)]
    // Fall back to an older row of the same indicator when the latest one has no total.
    if (!item.periodo) candidates.push(...rows.filter((r) => r.indicador === item.indicador))
    for (const row of candidates) {
      if (!row) continue
      const total = totalFor(row, rows, item.totalIndicador)
      const v = row.value
      if (!total || v.kind === 'missing') continue
      const [lo, hi] = v.kind === 'range' ? [v.min, v.max] : [v.value, v.value]
      out.push({
        key: `${row.line}`,
        label: item.label,
        row,
        total: total.value,
        totalApprox: total.approx,
        min: (lo / total.value) * 100,
        max: (hi / total.value) * 100,
        estimate: row.status === 'Estimativa' || total.approx,
      })
      break
    }
  }
  return out
}

const shareText = (s: Share) => (s.min === s.max ? `${s.estimate ? '≈ ' : ''}${pct(s.min)}` : `${pct(s.min).slice(0, -1)}–${pct(s.max)}`)

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-ink-2">
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-3.5 rounded-sm bg-lilac" aria-hidden />
        Documentado
      </span>
      <span className="flex items-center gap-1.5">
        <span className="fill-estimate h-2 w-3.5 rounded-sm" aria-hidden />
        Estimativa não verificada
      </span>
    </div>
  )
}

/** Share of women within each indicator's own total. Rows are never added together or compared on one absolute scale. */
export function ShareChart({ rows, className }: { rows: DataRow[]; className?: string }) {
  const shares = useMemo(() => buildShares(rows), [rows])
  const groups = useMemo(() => {
    const before = shares.filter((s) => (s.row.start ?? '') < '2022-01-01')
    const after = shares.filter((s) => (s.row.start ?? '') >= '2022-01-01')
    const span = (g: Share[]) => {
      const ys = g
        .flatMap((s) => [s.row.start, s.row.end])
        .filter((d): d is string => !!d)
        .map((d) => d.slice(0, 4))
        .sort()
      return ys.length ? `${ys[0]}–${ys.at(-1)}` : ''
    }
    return [
      { id: 'before', label: span(before), items: before },
      { id: 'after', label: span(after), items: after },
    ].filter((g) => g.items.length)
  }, [shares])
  const [groupId, setGroupId] = useState('after')
  const group = groups.find((g) => g.id === groupId) ?? groups[0]

  return (
    <Card
      title="Mulheres no total de cada indicador"
      className={className}
      delay={0.2}
      aside={
        <div className="flex max-w-full flex-wrap items-center gap-3">
          <Legend />
          {groups.length > 1 && (
            <div className="flex max-w-full overflow-x-auto rounded-lg border border-line p-0.5" role="radiogroup" aria-label="Período">
              {groups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  role="radio"
                  aria-checked={group?.id === g.id}
                  onClick={() => setGroupId(g.id)}
                  className={`tabular whitespace-nowrap rounded-md px-2.5 py-1 text-xs transition-colors ${group?.id === g.id ? 'bg-lilac/20 font-medium text-white' : 'text-ink-3 hover:text-ink'}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}
        </div>
      }
    >
      <div className="flex h-full flex-col">
        <ul className="flex flex-1 flex-col justify-between gap-2">
          {group?.items.map((s, i) => (
            <li
              key={s.key}
              className="group"
              title={`${s.row.indicador} (${s.row.periodo}) — ${s.row.observacoes} · Fonte citada: ${s.row.fonte} · linha ${s.row.line}`}
            >
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 text-xs">
                <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
                  <span className="text-ink transition-colors group-hover:text-white">{s.label}</span>
                  <span className="tabular text-[10.5px] text-ink-3">{s.row.periodo}</span>
                  {s.estimate && <StatusBadge status="Estimativa" className="self-center" />}
                </span>
                <span className="tabular text-ink-2">
                  <span className="font-semibold text-ink">{formatValue(s.row)}</span> de {s.totalApprox ? '≈ ' : ''}
                  {fmt(s.total)} · {shareText(s)}
                </span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.05]">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full ${s.estimate ? 'fill-estimate' : 'bg-lilac'} transition-opacity group-hover:opacity-80`}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.min}%` }}
                  transition={{ duration: 0.8, delay: 0.25 + i * 0.05, ease: 'easeOut' }}
                />
                {s.max > s.min && (
                  <motion.div
                    className="absolute inset-y-0 rounded-r-full border border-l-0 border-dashed border-estimate/70"
                    style={{ left: `${s.min}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.max - s.min}%` }}
                    transition={{ duration: 0.5, delay: 1.05 + i * 0.05, ease: 'easeOut' }}
                    aria-hidden
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[10.5px] leading-snug text-ink-3">
          Cada barra mostra a parcela de mulheres no total do próprio indicador (trilho = 100%); o total vem da mesma planilha (coluna Valor
          ou Observações). Períodos e universos diferem: não compare as linhas como série histórica nem some categorias.
        </p>
      </div>
    </Card>
  )
}
