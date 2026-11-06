import { useCallback, useEffect, useRef, useState } from 'react'
import { LIVE_API_INTERVAL_MS, POLL_INTERVAL_MS } from '../config'
import type { DashboardData, DatasetId, Displacement, Manifest } from './types'

/**
 * Loads the verified datasets from public/data/ and keeps them fresh while the
 * page stays open:
 *  - every POLL_INTERVAL_MS it re-reads data/manifest.json; when the scheduled
 *    GitHub Action has published new data, the datasets are re-fetched and the
 *    changed cards are flagged — no page reload needed;
 *  - the UNHCR figures are also requested straight from the UNHCR public API.
 *    If the API is unreachable, the last verified snapshot stays on screen.
 * Nothing here generates or interpolates numbers.
 */

const FILES: Record<keyof DashboardData, string> = {
  casualties: 'ohchr-civilian-casualties.json',
  crsv: 'ohchr-crsv-report.json',
  pgo: 'pgo-crsv.json',
  displacement: 'unhcr-displacement.json',
}
const KEY_TO_ID: Record<keyof DashboardData, DatasetId> = {
  casualties: 'ohchr-civilian-casualties',
  crsv: 'ohchr-crsv-report',
  pgo: 'pgo-crsv',
  displacement: 'unhcr-displacement',
}

const dataUrl = (file: string) => `${import.meta.env.BASE_URL}data/${file}`

async function getJson<T>(file: string): Promise<T> {
  const res = await fetch(dataUrl(file), { cache: 'no-cache' })
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`)
  return (await res.json()) as T
}

async function loadAll(): Promise<DashboardData> {
  const keys = Object.keys(FILES) as (keyof DashboardData)[]
  const values = await Promise.all(keys.map((k) => getJson(FILES[k])))
  return Object.fromEntries(keys.map((k, i) => [k, values[i]])) as unknown as DashboardData
}

const UNHCR_API = 'https://api.unhcr.org/population/v1/'
const num = (v: unknown) => (typeof v === 'number' ? v : Number(v) || 0)

/** Fetches refugees/IDPs from Ukraine straight from the UNHCR API. Throws on any inconsistency. */
async function fetchUnhcr(snapshot: Displacement, signal: AbortSignal): Promise<Displacement> {
  const thisYear = new Date().getFullYear()
  const popRes = await fetch(`${UNHCR_API}population/?coo=UKR&yearFrom=2021&yearTo=${thisYear}&limit=50`, { signal })
  if (!popRes.ok) throw new Error(`UNHCR population: HTTP ${popRes.status}`)
  const pop = (await popRes.json()) as { items: Record<string, unknown>[] }
  const years = pop.items
    .map((i) => ({ year: num(i.year), refugees: num(i.refugees), idps: num(i.idps) }))
    .filter((y) => y.year >= 2021 && y.refugees > 0)
    .sort((a, b) => a.year - b.year)
  if (!years.length) throw new Error('UNHCR population: empty')
  const latestYear = years[years.length - 1].year

  const demRes = await fetch(`${UNHCR_API}demographics/?coo=UKR&year=${latestYear}&ptype_show=true&limit=50`, { signal })
  if (!demRes.ok) throw new Error(`UNHCR demographics: HTTP ${demRes.status}`)
  const dem = (await demRes.json()) as { items: Record<string, unknown>[] }
  const split = (type: string) => {
    const row = dem.items.find((i) => i.pop_type === type)
    if (!row) throw new Error(`UNHCR demographics: no ${type} row`)
    return { total: num(row.total), female: num(row.f_total), male: num(row.m_total) }
  }
  const refugees = split('REF')
  const idps = split('IDP')
  const latestPop = years[years.length - 1]
  for (const [s, expected] of [
    [refugees, latestPop.refugees],
    [idps, latestPop.idps],
  ] as const) {
    if (s.total !== expected || s.female + s.male > s.total || s.female <= 0) throw new Error('UNHCR: inconsistent totals')
  }
  return { ...snapshot, years, latest: { year: latestYear, refugees, idps } }
}

export interface DataState {
  status: 'loading' | 'ready' | 'error'
  data: DashboardData | null
  error?: string
  /** Datasets whose contents changed while this page was open (value = when). */
  updated: Partial<Record<DatasetId, number>>
  /** True once the UNHCR figures on screen came from the live API in this session. */
  displacementLive: boolean
  /** Last time the page checked for new data. */
  lastCheck: number | null
}

export function useDashboardData(): DataState {
  const [state, setState] = useState<DataState>({ status: 'loading', data: null, updated: {}, displacementLive: false, lastCheck: null })
  const version = useRef<string | null>(null)
  const dataRef = useRef<DashboardData | null>(null)
  const liveRef = useRef(false)

  const apply = useCallback((next: DashboardData, live?: boolean) => {
    const prev = dataRef.current
    const changed: Partial<Record<DatasetId, number>> = {}
    if (prev) {
      for (const key of Object.keys(FILES) as (keyof DashboardData)[]) {
        // Compare the figures only; retrieval metadata changing alone is not "new data".
        const strip = (d: object) => JSON.stringify({ ...d, retrievedAt: undefined })
        if (strip(prev[key]) !== strip(next[key])) changed[KEY_TO_ID[key]] = Date.now()
      }
    }
    dataRef.current = next
    if (live) liveRef.current = true
    setState((s) => ({
      status: 'ready',
      data: next,
      updated: { ...s.updated, ...changed },
      displacementLive: live ?? s.displacementLive,
      lastCheck: Date.now(),
    }))
  }, [])

  // Initial load + manifest polling.
  useEffect(() => {
    let cancelled = false
    const check = async (initial: boolean) => {
      try {
        const manifest = await getJson<Manifest>('manifest.json')
        if (!initial && manifest.version === version.current) {
          if (!cancelled) setState((s) => ({ ...s, lastCheck: Date.now() }))
          return
        }
        const next = await loadAll()
        if (cancelled) return
        version.current = manifest.version
        // Keep live UNHCR numbers if the API already provided them.
        apply(liveRef.current && dataRef.current ? { ...next, displacement: dataRef.current.displacement } : next)
      } catch (e) {
        if (!cancelled && initial) setState((s) => ({ ...s, status: 'error', error: e instanceof Error ? e.message : String(e) }))
      }
    }
    void check(true)
    const id = window.setInterval(() => void check(false), POLL_INTERVAL_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') void check(false)
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [apply])

  // Live UNHCR API (falls back silently to the verified snapshot).
  const ready = state.status === 'ready'
  useEffect(() => {
    if (!ready) return
    const ctrl = new AbortController()
    const run = async () => {
      const current = dataRef.current
      if (!current) return
      try {
        const live = await fetchUnhcr(current.displacement, ctrl.signal)
        apply({ ...current, displacement: live }, true)
      } catch {
        /* keep the last verified snapshot */
      }
    }
    void run()
    const id = window.setInterval(() => void run(), LIVE_API_INTERVAL_MS)
    return () => {
      ctrl.abort()
      window.clearInterval(id)
    }
  }, [ready, apply])

  return state
}
