export interface Duration {
  years: number
  months: number
  days: number
}

/** Calendar duration between two ISO dates (YYYY-MM-DD). */
export function calendarDuration(fromISO: string, toISO: string): Duration {
  const [fy, fm, fd] = fromISO.split('-').map(Number)
  const [ty, tm, td] = toISO.split('-').map(Number)
  let years = ty - fy
  let months = tm - fm
  let days = td - fd
  if (days < 0) {
    months--
    days += new Date(Date.UTC(ty, tm - 1, 0)).getUTCDate()
  }
  if (months < 0) {
    years--
    months += 12
  }
  return years < 0 ? { years: 0, months: 0, days: 0 } : { years, months, days }
}

let kyivFormatter: Intl.DateTimeFormat | null = null

/** Today's date (YYYY-MM-DD) in Kyiv. */
export function kyivDateISO(now: number): string {
  if (!kyivFormatter) {
    const opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
    try {
      kyivFormatter = new Intl.DateTimeFormat('en-CA', { ...opts, timeZone: 'Europe/Kyiv' })
    } catch {
      kyivFormatter = new Intl.DateTimeFormat('en-CA', { ...opts, timeZone: 'Europe/Kiev' })
    }
  }
  return kyivFormatter.format(now)
}
