import { motion } from 'framer-motion'
import { latestRow } from '../data/dataset'
import type { DataRow } from '../types'
import { formatValue } from '../utils/format'
import { CountUp } from './CountUp'
import { SourceLink } from './SourceLink'
import { StatusBadge } from './StatusBadge'

/** Each card shows the most recent row of one spreadsheet indicator, with its period, status, note and source. */
const KPIS: { indicador: string; label: string; accent: string }[] = [
  { indicador: 'Vítimas de CRSV - mulheres', label: 'Mulheres vítimas de violência sexual relacionada ao conflito', accent: 'bg-alert' },
  { indicador: 'Civis mortas - mulheres', label: 'Mulheres civis mortas', accent: 'bg-lilac' },
  { indicador: 'Vítimas civis acumuladas - mulheres', label: 'Mulheres vítimas civis — acumulado', accent: 'bg-estimate' },
  {
    indicador: 'Aumento de casos registrados de violência doméstica',
    label: 'Aumento de casos registrados de violência doméstica',
    accent: 'bg-violet',
  },
]

function KpiValue({ row }: { row: DataRow }) {
  if (row.value.kind !== 'number') return <>{formatValue(row)}</>
  return <CountUp value={row.value.value} format={(n) => formatValue({ ...row, value: { kind: 'number', value: Math.round(n) } })} />
}

function Kpi({ label, row, accent, index }: { label: string; row: DataRow | undefined; accent: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card px-4 py-3"
    >
      <span className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r ${accent}`} aria-hidden />
      <p className="text-[11px] font-semibold uppercase leading-snug tracking-[0.12em] text-ink-2 lg:min-h-[2lh]">{label}</p>
      {row ? (
        <>
          <p className="tabular text-[30px] font-bold leading-tight tracking-tight text-white">
            <KpiValue row={row} />
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <StatusBadge status={row.status} />
            <span className="tabular text-[10.5px] text-ink-2">{row.periodo}</span>
          </div>
          <p className="mt-1 text-[10.5px] leading-snug text-ink-3">{row.observacoes}</p>
          <SourceLink row={row} className="mt-auto pt-1 text-[10.5px]" />
        </>
      ) : (
        <p className="mt-2 text-xs text-ink-3">Indicador não encontrado na planilha.</p>
      )}
    </motion.div>
  )
}

export function KpiCards({ rows }: { rows: DataRow[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {KPIS.map((k, i) => (
        <Kpi key={k.indicador} index={i} label={k.label} accent={k.accent} row={latestRow(rows, k.indicador)} />
      ))}
    </div>
  )
}
