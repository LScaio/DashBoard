import { REGIONS } from '../data/regions'
import { VIOLENCE_TYPES } from '../data/labels'
import type { DemoRecord, Region, ViolenceType } from '../types'

export const YEARS = [2022, 2023, 2024, 2025, 2026]

export interface YearPoint {
  year: number
  count: number
}

export function countByYear(records: DemoRecord[], type: ViolenceType | 'all'): YearPoint[] {
  return YEARS.map((year) => ({
    year,
    count: records.filter((r) => r.date.startsWith(String(year)) && (type === 'all' || r.type === type)).length,
  }))
}

export interface TypeShare {
  type: ViolenceType
  count: number
  pct: number
}

export function countByType(records: DemoRecord[]): TypeShare[] {
  return VIOLENCE_TYPES.map((type) => {
    const count = records.filter((r) => r.type === type).length
    return { type, count, pct: records.length ? (count / records.length) * 100 : 0 }
  }).sort((a, b) => b.count - a.count)
}

export interface RegionStat {
  region: Region
  count: number
  first: string | null
  last: string | null
}

export function statsByRegion(records: DemoRecord[]): RegionStat[] {
  return REGIONS.map((region) => {
    const dates = records
      .filter((r) => r.region === region.id)
      .map((r) => r.date)
      .sort()
    return { region, count: dates.length, first: dates[0] ?? null, last: dates[dates.length - 1] ?? null }
  })
}

export function share(records: DemoRecord[], predicate: (r: DemoRecord) => boolean): number {
  return records.length ? (records.filter(predicate).length / records.length) * 100 : 0
}
