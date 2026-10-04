const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/** Interpreta uma data ISO (AAAA-MM-DD) como UTC. */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export function todayISO(): string {
  const now = new Date()
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10)
}

/** "24 de fevereiro de 2022" */
export function formatDateLong(iso: string): string {
  const d = parseISODate(iso)
  return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`
}

/** "mar 2024" */
export function formatMonthYear(iso: string): string {
  const d = parseISODate(iso)
  return `${MESES_CURTOS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export interface Duration {
  years: number
  months: number
  days: number
  totalDays: number
}

/** Duração de calendário entre duas datas ISO (anos, meses, dias restantes). */
export function calendarDuration(fromISO: string, toISO: string): Duration {
  const from = parseISODate(fromISO)
  const to = parseISODate(toISO)
  if (to < from) return { years: 0, months: 0, days: 0, totalDays: 0 }

  let years = to.getUTCFullYear() - from.getUTCFullYear()
  let months = to.getUTCMonth() - from.getUTCMonth()
  let days = to.getUTCDate() - from.getUTCDate()

  if (days < 0) {
    months--
    days += new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), 0)).getUTCDate()
  }
  if (months < 0) {
    years--
    months += 12
  }
  const totalDays = Math.round((to.getTime() - from.getTime()) / 86_400_000)
  return { years, months, days, totalDays }
}
