import { SearchX } from 'lucide-react'
import { useDashboard } from '../../context/dashboardStore'

export function EmptyState({ message = 'No records match the current filters.' }: { message?: string }) {
  const { resetFilters, activeFilterCount } = useDashboard()
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center" role="status">
      <SearchX className="h-6 w-6 text-slate-500" aria-hidden />
      <p className="text-sm text-slate-400">{message}</p>
      {activeFilterCount > 0 && (
        <button type="button" onClick={resetFilters} className="text-xs font-medium text-blue-400 hover:text-blue-300">
          Reset filters
        </button>
      )}
    </div>
  )
}
