const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export function todayISO(): string {
  const now = new Date()
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10)
}

/** "12 Mar 2024" */
export function formatDate(iso: string): string {
  const d = parseISODate(iso)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/** "2024-03" → "Mar 2024" */
export function formatMonthKey(key: string): string {
  const [y, m] = key.split('-').map(Number)
  return `${MONTHS[m - 1]} ${y}`
}

/** Shifts an ISO date by a number of months (day clamped to month length). */
export function addMonths(iso: string, delta: number): string {
  const d = parseISODate(iso)
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + delta, 1))
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate()
  target.setUTCDate(Math.min(d.getUTCDate(), last))
  return target.toISOString().slice(0, 10)
}

export interface Duration {
  years: number
  months: number
  days: number
  totalDays: number
}

/** Calendar duration between two ISO dates. */
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
  return { years, months, days, totalDays: Math.round((to.getTime() - from.getTime()) / 86_400_000) }
}
