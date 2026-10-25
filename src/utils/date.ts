export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

/** Local calendar date of `d` as ISO (YYYY-MM-DD). */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
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
