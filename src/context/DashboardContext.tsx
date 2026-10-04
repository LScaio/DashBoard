import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { DEMO_INCIDENTS } from '../data/incidents'
import type { Filters, Incident } from '../types'
import { filterIncidents } from '../utils/analytics'
import { countActiveFilters, DashboardContext, DEFAULT_FILTERS, type DashboardState, type Toast } from './dashboardStore'

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<Filters>(DEFAULT_FILTERS)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedIncident, selectIncident] = useState<Incident | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastId = useRef(0)
  const updateTimer = useRef<number | undefined>(undefined)

  const setFilters = useCallback((f: Filters) => {
    setFiltersState(f)
    setIsUpdating(true)
    window.clearTimeout(updateTimer.current)
    updateTimer.current = window.setTimeout(() => setIsUpdating(false), 380)
  }, [])

  useEffect(() => () => window.clearTimeout(updateTimer.current), [])

  const patchFilters = useCallback((patch: Partial<Filters>) => setFilters({ ...filters, ...patch }), [filters, setFilters])
  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), [setFilters])

  const dismissToast = useCallback((id: number) => setToasts((ts) => ts.filter((t) => t.id !== id)), [])
  const pushToast = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = ++toastId.current
      setToasts((ts) => [...ts, { ...t, id }])
      window.setTimeout(() => dismissToast(id), 4200)
    },
    [dismissToast],
  )

  const records = useMemo(() => filterIncidents(DEMO_INCIDENTS, filters), [filters])

  const value = useMemo<DashboardState>(
    () => ({
      filters,
      setFilters,
      patchFilters,
      resetFilters,
      activeFilterCount: countActiveFilters(filters),
      records,
      allRecords: DEMO_INCIDENTS,
      isUpdating,
      selectedIncident,
      selectIncident,
      toasts,
      pushToast,
      dismissToast,
    }),
    [filters, setFilters, patchFilters, resetFilters, records, isUpdating, selectedIncident, toasts, pushToast, dismissToast],
  )

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}
