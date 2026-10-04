import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { countActiveFilters, DEFAULT_FILTERS, useDashboard } from '../../context/dashboardStore'
import { DATASET_META } from '../../data/incidents'
import type { Filters } from '../../types'
import { filterIncidents } from '../../utils/analytics'
import { todayISO } from '../../utils/date'
import { formatNumber } from '../../utils/format'
import { DataLabel } from '../ui/DataLabel'
import { ChipGroup, FilterGroup, Select } from './FilterField'
import { REGION_OPTIONS, SOURCE_OPTIONS, TYPE_OPTIONS, VERIFICATION_OPTIONS, VICTIM_OPTIONS } from './filterOptions'

interface FilterPanelProps {
  open: boolean
  onClose: () => void
}

const PRESETS: { label: string; from: string; to?: string }[] = [
  { label: 'Full conflict', from: DATASET_META.conflictStart },
  { label: '2022', from: '2022-02-24', to: '2022-12-31' },
  { label: '2023', from: '2023-01-01', to: '2023-12-31' },
  { label: '2024', from: '2024-01-01', to: '2024-12-31' },
  { label: '2025', from: '2025-01-01', to: '2025-12-31' },
  { label: '2026', from: '2026-01-01' },
]

const dateInputCls =
  'h-10 w-full rounded-lg border border-white/[0.09] bg-ink-950/70 px-3 text-[13px] text-slate-200 [color-scheme:dark] hover:border-white/20 focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20'

export function FilterPanel({ open, onClose }: FilterPanelProps) {
  return <AnimatePresence>{open && <FilterSheet key="filter-sheet" onClose={onClose} />}</AnimatePresence>
}

/** Mounted only while open, so the draft always starts from the applied filters. */
function FilterSheet({ onClose }: { onClose: () => void }) {
  const { filters, setFilters, allRecords } = useDashboard()
  const [draft, setDraft] = useState<Filters>(filters)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setDraft((d) => ({ ...d, [key]: value }))
  const preview = filterIncidents(allRecords, draft).length
  const invalidRange = draft.dateFrom > draft.dateTo
  const today = todayISO()

  const apply = () => {
    if (invalidRange) return
    setFilters(draft)
    onClose()
  }

  return (
    <>
      <motion.div
        className="no-print fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-title"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 36 }}
        className="no-print fixed inset-y-0 right-0 z-[61] flex w-full max-w-[420px] flex-col border-l border-white/[0.08] bg-ink-900/95 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="h-4 w-4 text-blue-400" aria-hidden />
            <h2 id="filter-title" className="text-[15px] font-semibold text-slate-100">
              Filters
            </h2>
            {countActiveFilters(draft) > 0 && (
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[11px] font-medium text-blue-300">
                {countActiveFilters(draft)} active
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.05] hover:text-white"
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <FilterGroup label="Date range">
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-1">
                <span className="text-[11px] text-slate-400">From</span>
                <input
                  type="date"
                  className={dateInputCls}
                  min={DATASET_META.conflictStart}
                  max={today}
                  value={draft.dateFrom}
                  onChange={(e) => e.target.value && set('dateFrom', e.target.value)}
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] text-slate-400">To</span>
                <input
                  type="date"
                  className={dateInputCls}
                  min={DATASET_META.conflictStart}
                  max={today}
                  value={draft.dateTo}
                  onChange={(e) => e.target.value && set('dateTo', e.target.value)}
                />
              </label>
            </div>
            {invalidRange && <p className="text-xs text-red-300">“From” must be before “To”.</p>}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESETS.map((p) => {
                const to = p.to ?? today
                const active = draft.dateFrom === p.from && draft.dateTo === to
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, dateFrom: p.from, dateTo: to }))}
                    className={
                      active
                        ? 'rounded-md border border-blue-400/40 bg-blue-500/15 px-2 py-1 text-[11px] font-medium text-blue-200'
                        : 'rounded-md border border-white/[0.07] px-2 py-1 text-[11px] text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
          </FilterGroup>

          <FilterGroup label="Region">
            <Select id="f-region" label="Region" value={draft.region} options={REGION_OPTIONS} onChange={(v) => set('region', v)} />
          </FilterGroup>

          <FilterGroup label="Violence type">
            <Select id="f-type" label="Violence type" value={draft.type} options={TYPE_OPTIONS} onChange={(v) => set('type', v)} />
          </FilterGroup>

          <FilterGroup label="Source type">
            <Select
              id="f-source"
              label="Source type"
              value={draft.sourceType}
              options={SOURCE_OPTIONS}
              onChange={(v) => set('sourceType', v)}
            />
          </FilterGroup>

          <FilterGroup label="Verification">
            <ChipGroup
              ariaLabel="Verification"
              value={draft.verification}
              options={VERIFICATION_OPTIONS}
              onChange={(v) => set('verification', v)}
            />
          </FilterGroup>

          <FilterGroup label="Victim group">
            <ChipGroup
              ariaLabel="Victim group"
              value={draft.victimGroup}
              options={VICTIM_OPTIONS}
              onChange={(v) => set('victimGroup', v)}
            />
          </FilterGroup>
        </div>

        <div className="space-y-3 border-t border-white/[0.06] bg-ink-950/50 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              <span className="tabular font-semibold text-slate-100">{formatNumber(preview)}</span> matching records
            </p>
            <DataLabel kind="demo" />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDraft(DEFAULT_FILTERS)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/[0.09] px-3.5 text-[13px] font-medium text-slate-300 hover:bg-white/[0.04]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset
            </button>
            <button
              type="button"
              onClick={apply}
              disabled={invalidRange}
              className="h-10 flex-1 rounded-lg bg-blue-600 text-[13px] font-semibold text-white shadow-lg shadow-blue-900/40 transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply filters
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
