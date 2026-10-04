import { createContext, useContext } from 'react'
import { DATASET_META } from '../data/incidents'
import type { Filters, Incident } from '../types'
import { todayISO } from '../utils/date'

export const DEFAULT_FILTERS: Filters = {
  dateFrom: DATASET_META.conflictStart,
  dateTo: todayISO(),
  region: 'all',
  type: 'all',
  sourceType: 'all',
  verification: 'all',
  victimGroup: 'all',
}

export interface Toast {
  id: number
  title: string
  description?: string
  tone: 'success' | 'info' | 'warning'
}

export interface DashboardState {
  filters: Filters
  setFilters: (f: Filters) => void
  patchFilters: (patch: Partial<Filters>) => void
  resetFilters: () => void
  activeFilterCount: number
  records: Incident[]
  allRecords: Incident[]
  /** True briefly after filters change — drives skeleton/transition states */
  isUpdating: boolean
  selectedIncident: Incident | null
  selectIncident: (r: Incident | null) => void
  toasts: Toast[]
  pushToast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: number) => void
}

export const DashboardContext = createContext<DashboardState | null>(null)

export function countActiveFilters(f: Filters): number {
  return (Object.keys(DEFAULT_FILTERS) as (keyof Filters)[]).filter((k) => f[k] !== DEFAULT_FILTERS[k]).length
}

export function useDashboard(): DashboardState {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}
