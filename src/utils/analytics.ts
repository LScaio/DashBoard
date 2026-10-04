import { TIMELINE_SERIES, VIOLENCE_TYPES, VERIFICATION_LEVELS, AGE_GROUPS, CONTEXTS } from '../data/labels'
import { REGIONS } from '../data/regions'
import type {
  AgeGroup,
  ConfidenceLevel,
  Filters,
  Incident,
  IncidentContext,
  RegionStat,
  TimelineSeries,
  Trend,
  VerificationLevel,
  ViolenceType,
} from '../types'
import { monthKey, monthRange, parseISODate, toISODate } from './date'

/* ---------------------------------------------------------------------------
 * Filtering
 * ------------------------------------------------------------------------ */

export function matchesVictimGroup(r: Incident, group: Filters['victimGroup']): boolean {
  switch (group) {
    case 'all':
      return true
    case 'civilian':
      return r.civilianStatus === 'civilian'
    case 'displaced':
      return r.civilianStatus === 'displaced'
    case 'under-18':
      return r.ageGroup === 'under-18'
    case 'adult':
      return r.ageGroup !== 'under-18'
  }
}

export function filterIncidents(records: Incident[], f: Filters): Incident[] {
  return records.filter(
    (r) =>
      r.date >= f.dateFrom &&
      r.date <= f.dateTo &&
      (f.region === 'all' || r.region === f.region) &&
      (f.type === 'all' || r.type === f.type) &&
      (f.sourceType === 'all' || r.sourceType === f.sourceType) &&
      (f.verification === 'all' || r.verification === f.verification) &&
      matchesVictimGroup(r, f.victimGroup),
  )
}

/* ---------------------------------------------------------------------------
 * Trends — compare the second half of the selected period with the first half
 * ------------------------------------------------------------------------ */

export function periodMidpoint(from: string, to: string): string {
  const a = parseISODate(from).getTime()
  const b = parseISODate(to).getTime()
  return toISODate(new Date(a + (b - a) / 2))
}

export function trendOf(current: number, previous: number): Trend {
  if (previous === 0) return { pct: null, direction: current > 0 ? 'up' : 'flat' }
  const pct = ((current - previous) / previous) * 100
  return { pct, direction: Math.abs(pct) < 1 ? 'flat' : pct > 0 ? 'up' : 'down' }
}

export function halfPeriodTrend(records: Incident[], from: string, to: string, predicate?: (r: Incident) => boolean): Trend {
  const mid = periodMidpoint(from, to)
  let first = 0
  let second = 0
  for (const r of records) {
    if (predicate && !predicate(r)) continue
    if (r.date <= mid) first++
    else second++
  }
  return trendOf(second, first)
}

/* ---------------------------------------------------------------------------
 * Aggregations
 * ------------------------------------------------------------------------ */

export type TimelinePoint = { month: string } & Record<TimelineSeries, number>

export function timelineByMonth(records: Incident[], from: string, to: string): TimelinePoint[] {
  const typeToSeries = new Map<ViolenceType, TimelineSeries>()
  for (const s of TIMELINE_SERIES) {
    if (s.id === 'all') continue
    for (const t of s.types) typeToSeries.set(t, s.id)
  }
  const buckets = new Map<string, TimelinePoint>(
    monthRange(from, to).map((m) => [m, { month: m, all: 0, sexual: 0, physical: 0, conflict: 0, other: 0 }]),
  )
  for (const r of records) {
    const b = buckets.get(monthKey(r.date))
    if (!b) continue
    b.all++
    const s = typeToSeries.get(r.type)
    if (s) b[s]++
  }
  return [...buckets.values()]
}

export interface Share<K extends string> {
  key: K
  count: number
  pct: number
}

function shares<K extends string>(keys: readonly K[], records: Incident[], get: (r: Incident) => K): Share<K>[] {
  const counts = new Map<K, number>(keys.map((k) => [k, 0]))
  for (const r of records) counts.set(get(r), (counts.get(get(r)) ?? 0) + 1)
  const total = records.length || 1
  return keys.map((key) => ({ key, count: counts.get(key) ?? 0, pct: ((counts.get(key) ?? 0) / total) * 100 }))
}

export interface TypeBreakdown extends Share<ViolenceType> {
  trend: Trend
}

export function typeBreakdown(records: Incident[], from: string, to: string): TypeBreakdown[] {
  return shares(VIOLENCE_TYPES, records, (r) => r.type).map((s) => ({
    ...s,
    trend: halfPeriodTrend(records, from, to, (r) => r.type === s.key),
  }))
}

export const ageBreakdown = (records: Incident[]) => shares<AgeGroup>(AGE_GROUPS, records, (r) => r.ageGroup)
export const contextBreakdown = (records: Incident[]) =>
  shares<IncidentContext>(CONTEXTS, records, (r) => r.context).sort((a, b) => b.count - a.count)
export const verificationBreakdown = (records: Incident[]) => shares<VerificationLevel>(VERIFICATION_LEVELS, records, (r) => r.verification)
export const civilianBreakdown = (records: Incident[]) =>
  shares<'civilian' | 'displaced'>(['civilian', 'displaced'], records, (r) => r.civilianStatus)

/** Share of records verified or corroborated. */
export function confirmedShare(records: Incident[]): number {
  if (!records.length) return 0
  return (records.filter((r) => r.verification === 'verified' || r.verification === 'corroborated').length / records.length) * 100
}

function confidenceOf(records: Incident[]): ConfidenceLevel {
  if (records.length < 5) return 'Low'
  const share = confirmedShare(records)
  if (share >= 55) return 'High'
  if (share >= 35) return 'Moderate'
  return 'Low'
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
    const dates = list.map((r) => r.date).sort()
    return {
      region,
      count: list.length,
      firstDate: dates[0] ?? null,
      lastDate: dates[dates.length - 1] ?? null,
      confidence: confidenceOf(list),
    }
  })
}

export function dateExtent(records: Incident[]): { first: string; last: string } | null {
  if (!records.length) return null
  let first = records[0].date
  let last = records[0].date
  for (const r of records) {
    if (r.date < first) first = r.date
    if (r.date > last) last = r.date
  }
  return { first, last }
}

export type Intensity = 'none' | 'low' | 'medium' | 'high'

/** Buckets a count relative to the highest regional count in the current view. */
export function intensityOf(count: number, max: number): Intensity {
  if (count === 0 || max === 0) return 'none'
  const ratio = count / max
  if (ratio > 2 / 3) return 'high'
  if (ratio > 1 / 3) return 'medium'
  return 'low'
}

/* ---------------------------------------------------------------------------
 * Key observations (auto-generated from the current selection)
 * ------------------------------------------------------------------------ */

export interface Observation {
  id: string
  tone: 'neutral' | 'alert' | 'caution' | 'positive'
  title: string
  body: string
}

const fmtPct = (n: number) => `${n.toFixed(n < 10 ? 1 : 0)}%`

export function buildObservations(records: Incident[], from: string, to: string, regionName: (id: string) => string): Observation[] {
  if (!records.length) return []
  const out: Observation[] = []

  const trend = halfPeriodTrend(records, from, to)
  if (trend.pct !== null && trend.direction !== 'flat') {
    out.push({
      id: 'trend',
      tone: trend.direction === 'up' ? 'alert' : 'neutral',
      title: `Reporting ${trend.direction === 'up' ? 'increased' : 'decreased'} during the selected period`,
      body: `Records in the second half of the period are ${fmtPct(Math.abs(trend.pct))} ${trend.direction === 'up' ? 'higher' : 'lower'} than in the first half. Changes in reporting may reflect documentation capacity as much as incidence.`,
    })
  }

  const regions = regionStats(records)
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count)
  if (regions.length > 1) {
    const top = regions[0]
    const share = (top.count / records.length) * 100
    out.push({
      id: 'region',
      tone: 'neutral',
      title: `${regionName(top.region.id)} ${share >= 15 ? 'represents a significant share' : 'has the largest share'} of documented records`,
      body: `${fmtPct(share)} of records in this demonstration dataset. Absolute counts are not comparable across regions without accounting for population, access and reporting capacity.`,
    })
  }

  const sexual = records.filter((r) => r.type === 'sexual').length
  out.push({
    id: 'crsv',
    tone: 'alert',
    title: `Sexual violence represents ${fmtPct((sexual / records.length) * 100)} of documented records`,
    body: 'Conflict-related sexual violence is typically among the most underreported categories; documented records are a lower bound.',
  })

  const confirmed = confirmedShare(records)
  out.push({
    id: 'verification',
    tone: confirmed >= 50 ? 'positive' : 'caution',
    title: `${fmtPct(confirmed)} of records are verified or corroborated`,
    body: 'Recent records typically show lower verification levels because confirmation takes time (verification lag).',
  })

  const displaced = records.filter((r) => r.civilianStatus === 'displaced').length
  out.push({
    id: 'displacement',
    tone: 'neutral',
    title: `${fmtPct((displaced / records.length) * 100)} of records involve displaced women and girls`,
    body: 'Displacement-linked records include incidents during flight, in transit and in host communities.',
  })

  return out
}
