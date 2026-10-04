import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { DEMO_INCIDENTS } from '../data/demoIncidents'
import type { Filters, Incident, PageId } from '../types'
import { applyFilters } from '../utils/metrics'
import { DashboardContext, DEFAULT_FILTERS, type DashboardState } from './dashboardStore'

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>('overview')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [search, setSearch] = useState('')
  const [selected, select] = useState<Incident | null>(null)

  const patchFilters = useCallback(
    (patch: Partial<Filters>) =>
      setFilters((f) => {
        const next = { ...f, ...patch }
        // Keep the year range ordered whichever end was changed.
        if (next.yearFrom > next.yearTo) {
          if ('yearFrom' in patch) next.yearTo = next.yearFrom
          else next.yearFrom = next.yearTo
        }
        return next
      }),
    [],
  )
  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), [])
  const records = useMemo(() => applyFilters(DEMO_INCIDENTS, filters), [filters])
  const activeFilterCount = (Object.keys(DEFAULT_FILTERS) as (keyof Filters)[]).filter((k) => filters[k] !== DEFAULT_FILTERS[k]).length

  const value = useMemo<DashboardState>(
    () => ({
      page,
      setPage,
      filters,
      patchFilters,
      resetFilters,
      activeFilterCount,
      search,
      setSearch,
      records,
      allRecords: DEMO_INCIDENTS,
      selected,
      select,
    }),
    [page, filters, patchFilters, resetFilters, activeFilterCount, search, records, selected],
  )
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}
