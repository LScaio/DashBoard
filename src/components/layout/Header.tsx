import { CalendarRange, Menu, Search, SlidersHorizontal, X } from 'lucide-react'
import { useDashboard } from '../../state/dashboardStore'
import { cn } from '../../utils/format'
import { DemoTag } from '../ui/DemoTag'

interface HeaderProps {
  filtersOpen: boolean
  onToggleFilters: () => void
  onOpenMenu: () => void
}

export function Header({ filtersOpen, onToggleFilters, onOpenMenu }: HeaderProps) {
  const { search, setSearch, setPage, page, activeFilterCount } = useDashboard()
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <button
          type="button"
          onClick={onOpenMenu}
          className="rounded-md p-1.5 text-ink-2 hover:text-white md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[17px] font-semibold leading-tight text-white">Women &amp; Conflict</h1>
          <p className="truncate text-xs text-ink-3">Ukraine — Violence Data Analysis</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-3" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                if (page !== 'overview' && page !== 'incidents') setPage('incidents')
              }}
              placeholder="Search records…"
              aria-label="Search incident records"
              className="h-9 w-44 rounded-lg border border-line bg-panel pl-8 pr-7 text-[13px] text-ink placeholder:text-ink-3 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 xl:w-56"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-3 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onToggleFilters}
            aria-expanded={filtersOpen}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium transition-colors',
              filtersOpen ? 'border-primary/40 bg-primary/10 text-white' : 'border-line bg-panel text-ink-2 hover:text-white',
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 text-[10px] font-semibold text-white">{activeFilterCount}</span>
            )}
          </button>
          <div className="hidden items-center gap-1.5 rounded-lg border border-line bg-panel px-3 py-2 font-mono text-[11px] text-ink-2 lg:flex">
            <CalendarRange className="h-3.5 w-3.5 text-ink-3" aria-hidden />
            24 FEB 2022 → PRESENT
          </div>
          <DemoTag className="hidden py-1 sm:inline-flex" />
        </div>
      </div>
    </header>
  )
}
