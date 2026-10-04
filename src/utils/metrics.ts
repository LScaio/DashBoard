import { AGE_GROUPS, VICTIM_GROUPS, VIOLENCE_TYPES } from '../data/labels'
import { REGIONS } from '../data/regions'
import type { AgeGroup, Confidence, Filters, Incident, Region, VictimGroup, ViolenceType } from '../types'
import { addMonths, calendarDuration, todayISO } from './date'

/* ---------------------------------------------------------------- filters */

export function rangeOf(f: Filters): { from: string; to: string } {
  const today = todayISO()
  const to = `${f.yearTo}-12-31`
  return { from: `${f.yearFrom}-01-01`, to: to > today ? today : to }
}

/** Applies every filter except the date range. */
export function matchesDimensions(r: Incident, f: Filters): boolean {
  return (
    (f.region === 'all' || r.region === f.region) &&
    (f.type === 'all' || r.type === f.type) &&
    (f.victimGroup === 'all' || r.victimGroup === f.victimGroup) &&
    (f.verification === 'all' || r.verification === f.verification)
  )
}

export function applyFilters(records: Incident[], f: Filters): Incident[] {
  const { from, to } = rangeOf(f)
  return records.filter((r) => r.date >= from && r.date <= to && matchesDimensions(r, f))
}

/* ------------------------------------------------------------------- KPIs */

export interface Kpis {
  total: number
  /** Change of the last 12 months of the range vs the 12 months before; null when no prior data */
  change: number | null
  sexual: number
  sexualShare: number
  regions: number
  firstYear: number | null
  lastYear: number | null
  /** Human-readable span between the first and last record, e.g. "4 years" or "11 months" */
  spanLabel: string
}

function spanLabel(first: string, last: string): string {
  const d = calendarDuration(first, last)
  if (d.years >= 1) return `${d.years} ${d.years === 1 ? 'year' : 'years'}`
  const months = d.months + (d.days >= 15 ? 1 : 0)
  return months >= 1 ? `${months} ${months === 1 ? 'month' : 'months'}` : `${d.totalDays + 1} days`
}

export function computeKpis(all: Incident[], filtered: Incident[], f: Filters): Kpis {
  const { to } = rangeOf(f)
  const lastStart = addMonths(to, -12)
  const prevStart = addMonths(to, -24)
  let current = 0
  let previous = 0
  for (const r of all) {
    if (!matchesDimensions(r, f)) continue
    if (r.date > lastStart && r.date <= to) current++
    else if (r.date > prevStart && r.date <= lastStart) previous++
  }
  const sexual = filtered.filter((r) => r.type === 'sexual').length
  const dates = filtered.map((r) => r.date).sort()
  const first = dates[0]
  const last = dates[dates.length - 1]
  return {
    total: filtered.length,
    change: previous ? ((current - previous) / previous) * 100 : null,
    sexual,
    sexualShare: filtered.length ? (sexual / filtered.length) * 100 : 0,
    regions: new Set(filtered.map((r) => r.region)).size,
    firstYear: first ? Number(first.slice(0, 4)) : null,
    lastYear: last ? Number(last.slice(0, 4)) : null,
    spanLabel: first && last ? spanLabel(first, last) : '',
  }
}

/* ------------------------------------------------------------- aggregates */

export type ChartSeries = 'all' | 'sexual' | 'physical' | 'psychological'

export interface MonthPoint {
  month: string
  count: number
}

export function monthlySeries(records: Incident[], f: Filters, series: ChartSeries): MonthPoint[] {
  const { from, to } = rangeOf(f)
  const buckets = new Map<string, number>()
  for (let m = from.slice(0, 7); m <= to.slice(0, 7); m = addMonths(`${m}-01`, 1).slice(0, 7)) {
    if (m >= '2022-02') buckets.set(m, 0)
  }
  for (const r of records) {
    if (series !== 'all' && r.type !== series) continue
    const key = r.date.slice(0, 7)
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1)
  }
  return [...buckets].map(([month, count]) => ({ month, count }))
}

export function yearlyCounts(records: Incident[], f: Filters): { year: number; count: number }[] {
  const years: { year: number; count: number }[] = []
  for (let y = Math.max(2022, f.yearFrom); y <= f.yearTo; y++)
    years.push({ year: y, count: records.filter((r) => r.date.startsWith(String(y))).length })
  return years
}

export interface Share<K> {
  key: K
  count: number
  pct: number
}

function shares<K extends string>(keys: readonly K[], records: Incident[], get: (r: Incident) => K | null): Share<K>[] {
  const counts = new Map<K, number>()
  let total = 0
  for (const r of records) {
    const k = get(r)
    if (k === null) continue
    counts.set(k, (counts.get(k) ?? 0) + 1)
    total++
  }
  return keys.map((key) => ({ key, count: counts.get(key) ?? 0, pct: total ? ((counts.get(key) ?? 0) / total) * 100 : 0 }))
}

export const typeShares = (records: Incident[]) => shares<ViolenceType>(VIOLENCE_TYPES, records, (r) => r.type)
export const ageShares = (records: Incident[]) => shares<AgeGroup>(AGE_GROUPS, records, (r) => r.ageGroup)
export const groupShares = (records: Incident[]) => shares<VictimGroup>(VICTIM_GROUPS, records, (r) => r.victimGroup)

export function confidenceOf(records: Incident[]): Confidence {
  if (records.length < 30) return 'Low'
  const confirmed = records.filter((r) => r.verification === 'verified' || r.verification === 'corroborated').length / records.length
  if (confirmed >= 0.6) return 'High'
  if (confirmed >= 0.45) return 'Medium'
  return 'Low'
}

export interface RegionStat {
  region: Region
  count: number
  firstYear: number | null
  lastYear: number | null
  confidence: Confidence
}

export function regionStats(records: Incident[]): RegionStat[] {
  const byRegion = new Map<string, Incident[]>()
  for (const r of records) {
    const list = byRegion.get(r.region)
    if (list) list.push(r)
    else byRegion.set(r.region, [r])
  }
  return REGIONS.map((region) => {
    const list = byRegion.get(region.id) ?? []
    let first: string | null = null
    let last: string | null = null
    for (const r of list) {
      if (!first || r.date < first) first = r.date
      if (!last || r.date > last) last = r.date
    }
    return {
      region,
      count: list.length,
      firstYear: first ? Number(first.slice(0, 4)) : null,
      lastYear: last ? Number(last.slice(0, 4)) : null,
      confidence: confidenceOf(list),
    }
  })
}
