import { VIOLENCE_TYPES } from '../data/labels'
import { REGIONS } from '../data/regions'
import type { Incident, Region, ViolenceType } from '../types'

const nf = new Intl.NumberFormat('pt-BR')
export const fmt = (n: number) => nf.format(Math.round(n))

export interface Kpis {
  total: number
  sexual: number
  regions: number
  firstYear: number
  lastYear: number
}

export function computeKpis(records: Incident[]): Kpis {
  const years = records.map((r) => Number(r.date.slice(0, 4)))
  return {
    total: records.length,
    sexual: records.filter((r) => r.type === 'sexual').length,
    regions: new Set(records.map((r) => r.region)).size,
    firstYear: Math.min(...years),
    lastYear: Math.max(...years),
  }
}

export type Series = 'all' | 'sexual' | 'physical' | 'psychological'

/** Monthly counts ("2024-03") from the first to the last month in the data. */
export function monthlyCounts(records: Incident[], series: Series): { month: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const r of records) {
    if (series !== 'all' && r.type !== series) continue
    const key = r.date.slice(0, 7)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const months = records.map((r) => r.date.slice(0, 7)).sort()
  const out: { month: string; count: number }[] = []
  let [y, m] = months[0].split('-').map(Number)
  const last = months[months.length - 1]
  for (;;) {
    const key = `${y}-${String(m).padStart(2, '0')}`
    out.push({ month: key, count: counts.get(key) ?? 0 })
    if (key >= last) break
    if (m === 12) {
      m = 1
      y++
    } else m++
  }
  return out
}

export function countsByType(records: Incident[]): { type: ViolenceType; count: number }[] {
  return VIOLENCE_TYPES.map((type) => ({ type, count: records.filter((r) => r.type === type).length }))
}

export function countsByRegion(records: Incident[]): { region: Region; count: number }[] {
  const counts = new Map<string, number>()
  for (const r of records) counts.set(r.region, (counts.get(r.region) ?? 0) + 1)
  return REGIONS.map((region) => ({ region, count: counts.get(region.id) ?? 0 }))
}
