import type { DataRow } from '../types'

const nf = new Intl.NumberFormat('pt-BR')
const pf = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const tf = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const df = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const fmt = (n: number) => nf.format(n)
/** 34.5 → "34,5%" */
export const pct = (n: number) => `${pf.format(n)}%`
/** Date → "14:32:07" */
export const clock = (d: Date) => tf.format(d)
/** Date → "25/10/2026" */
export const day = (d: Date) => df.format(d)

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
/** "2026-07-31" → "31/07/2026" */
export const isoToBR = (iso: string) => iso.split('-').reverse().join('/')
/** "2026-07-31" → "jul 2026" */
export const monthYear = (iso: string) => `${MESES[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`

/**
 * A row's value as shown everywhere on the dashboard: estimates carry "≈",
 * minimum estimates "mais de", ranges stay ranges and text stays text.
 */
export function formatValue(r: DataRow): string {
  const v = r.value
  if (v.kind === 'missing') return v.text
  if (v.kind === 'range') return `${fmt(v.min)}–${fmt(v.max)}`
  const prefix = /mínima/i.test(r.metodo) ? 'mais de ' : r.status === 'Estimativa' ? '≈ ' : ''
  return `${prefix}${fmt(v.value)}${r.unidade === 'percentual' ? '%' : ''}`
}
