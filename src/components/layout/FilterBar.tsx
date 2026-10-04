import { RotateCcw } from 'lucide-react'
import { TYPE_LABEL, VERIFICATION_LABEL, VERIFICATIONS, VICTIM_GROUPS, VICTIM_LABEL, VIOLENCE_TYPES } from '../../data/labels'
import { REGIONS } from '../../data/regions'
import { useDashboard, YEARS } from '../../state/dashboardStore'
import type { Filters } from '../../types'
import { fmt } from '../../utils/format'
import { Select } from '../ui/Select'

const yearOptions = YEARS.map((y) => ({ value: y, label: String(y) }))
const regionOptions: { value: Filters['region']; label: string }[] = [
  { value: 'all', label: 'All regions' },
  ...[...REGIONS].sort((a, b) => a.name.localeCompare(b.name)).map((r) => ({ value: r.id, label: r.name })),
]
const typeOptions: { value: Filters['type']; label: string }[] = [
  { value: 'all', label: 'All types' },
  ...VIOLENCE_TYPES.map((t) => ({ value: t, label: TYPE_LABEL[t] })),
]
const groupOptions: { value: Filters['victimGroup']; label: string }[] = [
  { value: 'all', label: 'All' },
  ...VICTIM_GROUPS.map((g) => ({ value: g, label: VICTIM_LABEL[g] })),
]
const verificationOptions: { value: Filters['verification']; label: string }[] = [
  { value: 'all', label: 'All' },
  ...VERIFICATIONS.map((v) => ({ value: v, label: VERIFICATION_LABEL[v] })),
]

export function FilterBar() {
  const { filters, patchFilters, resetFilters, activeFilterCount, records, allRecords } = useDashboard()
  return (
    <div className="border-b border-line bg-[#0a0e16] px-4 py-3 lg:px-6">
      <div className="grid grid-cols-2 items-end gap-3 sm:grid-cols-3 xl:grid-cols-[auto_repeat(4,minmax(0,1fr))_auto]">
        <fieldset className="col-span-2 sm:col-span-1">
          <legend className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-3">Date range</legend>
          <div className="flex items-center gap-1.5">
            <Select
              id="f-year-from"
              label="From year"
              hideLabel
              value={filters.yearFrom}
              options={yearOptions}
              onChange={(v) => patchFilters({ yearFrom: v })}
              className="w-[88px]"
            />
            <span className="text-ink-3">—</span>
            <Select
              id="f-year-to"
              label="To year"
              hideLabel
              value={filters.yearTo}
              options={yearOptions}
              onChange={(v) => patchFilters({ yearTo: v })}
              className="w-[88px]"
            />
          </div>
        </fieldset>
        <Select id="f-region" label="Region" value={filters.region} options={regionOptions} onChange={(v) => patchFilters({ region: v })} />
        <Select id="f-type" label="Violence type" value={filters.type} options={typeOptions} onChange={(v) => patchFilters({ type: v })} />
        <Select
          id="f-group"
          label="Victim group"
          value={filters.victimGroup}
          options={groupOptions}
          onChange={(v) => patchFilters({ victimGroup: v })}
        />
        <Select
          id="f-verification"
          label="Verification"
          value={filters.verification}
          options={verificationOptions}
          onChange={(v) => patchFilters({ verification: v })}
        />
        <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-3 xl:col-span-1 xl:justify-end">
          <span className="tabular whitespace-nowrap text-xs text-ink-3">
            <span className="font-semibold text-ink">{fmt(records.length)}</span> / {fmt(allRecords.length)} records
          </span>
          <button
            type="button"
            onClick={resetFilters}
            disabled={activeFilterCount === 0}
            className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line px-3 text-xs font-semibold uppercase tracking-wider text-ink-2 transition-colors hover:border-line-2 hover:text-white disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset filters
          </button>
        </div>
      </div>
    </div>
  )
}
