const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/** Parses an ISO date (YYYY-MM-DD) as a UTC date. */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function todayISO(): string {
  const now = new Date()
  return toISODate(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())))
}

/** "12 Mar 2024" */
export function formatDate(iso: string): string {
  const d = parseISODate(iso)
  return `${d.getUTCDate()} ${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/** "24 February 2022" */
export function formatDateLong(iso: string): string {
  const d = parseISODate(iso)
  return `${d.getUTCDate()} ${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/** "2024-03" → "Mar 2024" */
export function formatMonthKey(key: string): string {
  const [y, m] = key.split('-').map(Number)
  return `${MONTHS_SHORT[m - 1]} ${y}`
}

/** "2024-03" → "Mar ’24" (compact axis label) */
export function formatMonthKeyShort(key: string): string {
  const [y, m] = key.split('-').map(Number)
  return `${MONTHS_SHORT[m - 1]} ’${String(y).slice(2)}`
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7)
}

/** All month keys between two ISO dates, inclusive. */
export function monthRange(fromISO: string, toISO: string): string[] {
  const keys: string[] = []
  const from = parseISODate(fromISO)
  const to = parseISODate(toISO)
  let y = from.getUTCFullYear()
  let m = from.getUTCMonth()
  while (y < to.getUTCFullYear() || (y === to.getUTCFullYear() && m <= to.getUTCMonth())) {
    keys.push(`${y}-${String(m + 1).padStart(2, '0')}`)
    m++
    if (m === 12) {
      m = 0
      y++
    }
  }
  return keys
}

export interface Duration {
  years: number
  months: number
  days: number
  totalDays: number
}

/** Calendar duration between two ISO dates (years, months, remaining days). */
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
