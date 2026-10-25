import { useEffect, useRef, useState } from 'react'
import { DATA_URL, META_URL, parseDataset } from '../data/dataset'
import type { Dataset } from '../types'

/** How often the page re-reads the published CSV files. */
export const CHECK_INTERVAL_MS = 60_000

export type CheckResult = 'first-load' | 'unchanged' | 'changed' | 'failed'

export interface SourceState {
  dataset: Dataset | null
  /** When the values currently on screen were read from the files */
  loadedAt: Date | null
  checkedAt: Date | null
  nextCheckAt: Date | null
  lastResult: CheckResult | null
  error: string | null
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  return res.text()
}

/**
 * "Atualização simulada": there is no live feed. The page re-reads the same
 * published CSV files on an interval and only swaps the values when the file
 * contents actually differ — an unchanged check never touches the numbers.
 */
export function useDataSource(intervalMs = CHECK_INTERVAL_MS): SourceState {
  const [state, setState] = useState<SourceState>({
    dataset: null,
    loadedAt: null,
    checkedAt: null,
    nextCheckAt: null,
    lastResult: null,
    error: null,
  })
  const lastRaw = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const check = async () => {
      let next: Partial<SourceState>
      let raw: string | null = null
      try {
        const [dados, meta] = await Promise.all([fetchText(DATA_URL), fetchText(META_URL)])
        raw = `${dados}\u0000${meta}`
        if (raw === lastRaw.current) next = { lastResult: 'unchanged', error: null }
        else {
          const dataset = parseDataset(dados, meta)
          next = { dataset, loadedAt: new Date(), lastResult: lastRaw.current === null ? 'first-load' : 'changed', error: null }
        }
      } catch (e) {
        raw = null
        next = { lastResult: 'failed', error: e instanceof Error ? e.message : String(e) }
      }
      if (cancelled) return
      if (raw !== null) lastRaw.current = raw
      const checkedAt = new Date()
      setState((s) => ({ ...s, ...next, checkedAt, nextCheckAt: new Date(checkedAt.getTime() + intervalMs) }))
      timer = setTimeout(check, intervalMs)
    }

    check()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [intervalMs])

  return state
}
