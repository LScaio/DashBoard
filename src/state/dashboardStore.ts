import { createContext, useContext } from 'react'
import type { Filters, Incident, PageId } from '../types'

export const FIRST_YEAR = 2022
export const LAST_YEAR = new Date().getFullYear()
export const YEARS = Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i)

export const DEFAULT_FILTERS: Filters = {
  yearFrom: FIRST_YEAR,
  yearTo: LAST_YEAR,
  region: 'all',
  type: 'all',
  victimGroup: 'all',
  verification: 'all',
}

export interface DashboardState {
  page: PageId
  setPage: (p: PageId) => void
  filters: Filters
  patchFilters: (patch: Partial<Filters>) => void
  resetFilters: () => void
  activeFilterCount: number
  search: string
  setSearch: (s: string) => void
  /** Records matching the filters */
  records: Incident[]
  allRecords: Incident[]
  selected: Incident | null
  select: (r: Incident | null) => void
}

export const DashboardContext = createContext<DashboardState | null>(null)

export function useDashboard(): DashboardState {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider')
  return ctx
}
