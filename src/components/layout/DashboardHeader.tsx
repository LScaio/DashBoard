import { CalendarRange, Menu, SlidersHorizontal } from 'lucide-react'
import { useDashboard } from '../../context/dashboardStore'
import { formatDate } from '../../utils/date'
import { ExportMenu } from '../dashboard/ExportMenu'
import { InfoTip } from '../ui/InfoTip'

interface DashboardHeaderProps {
  onOpenFilters: () => void
  onOpenMenu: () => void
}

export function DashboardHeader({ onOpenFilters, onOpenMenu }: DashboardHeaderProps) {
  const { filters, activeFilterCount } = useDashboard()
  return (
    <header className="no-print sticky top-0 z-30 border-b border-white/[0.06] bg-ink-950/75 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          className="-ml-1 rounded-lg p-2 text-slate-400 hover:bg-white/[0.04] hover:text-white md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-semibold tracking-tight text-slate-50 sm:text-lg">
            Violence Against Women in the Ukraine War
          </h1>
          <p className="hidden truncate text-[12.5px] text-slate-400 sm:block">Humanitarian impact and documented violence analysis</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 lg:flex">
            <CalendarRange className="h-3.5 w-3.5 text-slate-500" aria-hidden />
            <div className="leading-tight">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-500">Period analysed</p>
              <p className="tabular text-[12px] font-medium text-slate-200">
                {formatDate(filters.dateFrom)} – {formatDate(filters.dateTo)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenFilters}
            className="relative inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.03] px-3 text-[13px] font-medium text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
            aria-label={`Open filters${activeFilterCount ? ` (${activeFilterCount} active)` : ''}`}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <ExportMenu />

          <div className="hidden items-center gap-1.5 rounded-lg border border-amber-400/25 bg-amber-400/[0.07] px-2.5 py-1.5 xl:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" aria-hidden />
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-amber-300">Demo Dataset</span>
            <InfoTip
              side="bottom"
              content="All figures are generated from a synthetic demonstration dataset. They are not official statistics and do not describe real events."
            />
          </div>
        </div>
      </div>
    </header>
  )
}
