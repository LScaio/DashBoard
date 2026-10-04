import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw, X } from 'lucide-react'
import { DEFAULT_FILTERS, useDashboard } from '../../context/dashboardStore'
import { SOURCE_TYPE_LABEL, VERIFICATION_LABEL, VICTIM_GROUP_LABEL, VIOLENCE_TYPE_LABEL } from '../../data/labels'
import { REGION_BY_ID } from '../../data/regions'
import type { Filters } from '../../types'
import { formatDate } from '../../utils/date'
import { formatNumber } from '../../utils/format'

interface Chip {
  key: string
  label: string
  reset: Partial<Filters>
}

function chipsFor(f: Filters): Chip[] {
  const chips: Chip[] = []
  if (f.dateFrom !== DEFAULT_FILTERS.dateFrom || f.dateTo !== DEFAULT_FILTERS.dateTo)
    chips.push({
      key: 'date',
      label: `${formatDate(f.dateFrom)} – ${formatDate(f.dateTo)}`,
      reset: { dateFrom: DEFAULT_FILTERS.dateFrom, dateTo: DEFAULT_FILTERS.dateTo },
    })
  if (f.region !== 'all') chips.push({ key: 'region', label: REGION_BY_ID[f.region].name, reset: { region: 'all' } })
  if (f.type !== 'all') chips.push({ key: 'type', label: VIOLENCE_TYPE_LABEL[f.type], reset: { type: 'all' } })
  if (f.sourceType !== 'all') chips.push({ key: 'source', label: SOURCE_TYPE_LABEL[f.sourceType], reset: { sourceType: 'all' } })
  if (f.verification !== 'all')
    chips.push({ key: 'verification', label: VERIFICATION_LABEL[f.verification], reset: { verification: 'all' } })
  if (f.victimGroup !== 'all') chips.push({ key: 'victim', label: VICTIM_GROUP_LABEL[f.victimGroup], reset: { victimGroup: 'all' } })
  return chips
}

export function ActiveFilters() {
  const { filters, patchFilters, resetFilters, records, allRecords } = useDashboard()
  const chips = chipsFor(filters)

  return (
    <AnimatePresence initial={false}>
      {chips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="no-print overflow-hidden"
        >
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-blue-400/15 bg-blue-500/[0.05] px-3 py-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-300/80">Active filters</span>
            <AnimatePresence initial={false}>
              {chips.map((c) => (
                <motion.span
                  key={c.key}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-ink-800/80 py-0.5 pl-2 pr-1 text-xs text-slate-200"
                >
                  {c.label}
                  <button
                    type="button"
                    onClick={() => patchFilters(c.reset)}
                    className="rounded p-0.5 text-slate-500 hover:bg-white/10 hover:text-white"
                    aria-label={`Remove filter ${c.label}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
            <span className="tabular ml-auto text-xs text-slate-400">
              {formatNumber(records.length)} of {formatNumber(allRecords.length)} records
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-blue-300 hover:bg-blue-500/10"
            >
              <RotateCcw className="h-3 w-3" aria-hidden /> Reset filters
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
