const nf = new Intl.NumberFormat('pt-BR')
const pf = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 0 })
const compact = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 2 })

/** 17605 → "17.605" */
export const fmt = (n: number) => nf.format(Math.round(n))
/** 0.338 → "34%" */
export const pct = (part: number, whole: number) => (whole ? pf.format(part / whole) : '–')
/** 4847837 → "4,85 mi" */
export const fmtCompact = (n: number) =>
  compact
    .format(n)
    .replace(/\s?mi$/, ' mi')
    .replace(/\s?mil$/, ' mil')

export const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
export const MESES_LONGOS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

/** "2026-10-15" → "15/10/2026" */
export function fmtDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

/** "2026-09" → "set/2026" */
export function fmtMonth(key: string): string {
  const [y, m] = key.split('-').map(Number)
  return `${MESES[m - 1]}/${y}`
}

/** "2026-09" → "setembro de 2026" */
export function fmtMonthLong(key: string): string {
  const [y, m] = key.split('-').map(Number)
  return `${MESES_LONGOS[m - 1]} de ${y}`
}

/** "2022-02-24" → "24 fev 2022" */
export function fmtDateShort(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return `${d} ${MESES[m - 1]} ${y}`
}

/** Midday UTC timestamp of an ISO date or month key (stable position on a time axis). */
export function dayMs(iso: string): number {
  const [y, m, d = 15] = iso.split('-').map(Number)
  return Date.UTC(y, m - 1, d, 12)
}

/** Whole days between an ISO date and now. */
export function daysSince(iso: string, now = Date.now()): number {
  return Math.floor((now - Date.parse(`${iso.slice(0, 10)}T00:00:00Z`)) / 86_400_000)
}

export const plural = (n: number, one: string, many: string) => `${fmt(n)} ${n === 1 ? one : many}`
