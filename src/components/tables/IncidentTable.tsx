import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search, Table2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDashboard } from '../../context/dashboardStore'
import { SOURCE_TYPE_LABEL, STATUS_LABEL, VIOLENCE_TYPE_COLOR, VIOLENCE_TYPE_LABEL, VIOLENCE_TYPES } from '../../data/labels'
import { REGION_BY_ID } from '../../data/regions'
import type { ViolenceType } from '../../types'
import { cn, formatNumber } from '../../utils/format'
import { Select } from '../filters/FilterField'
import { Badge } from '../ui/Badge'
import { DataLabel } from '../ui/DataLabel'
import { EmptyState } from '../ui/EmptyState'
import { Panel } from '../ui/Panel'
import { Skeleton } from '../ui/Skeleton'
import { VerificationBadge } from '../ui/VerificationBadge'
import { COLUMNS, SORT_VALUE, STATUS_TONE, searchText, victimGroupLabel, type SortKey } from './tableColumns'

const PAGE_SIZE = 10

export function IncidentTable() {
  const { records, isUpdating, selectIncident } = useDashboard()
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<ViolenceType | 'all'>('all')
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'date', dir: 'desc' })
  const [page, setPage] = useState(0)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = records.filter((r) => (typeFilter === 'all' || r.type === typeFilter) && (!q || searchText(r).includes(q)))
    const get = SORT_VALUE[sort.key]
    return [...filtered].sort((a, b) => {
      const va = get(a)
      const vb = get(b)
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))
      return (sort.dir === 'asc' ? cmp : -cmp) || b.date.localeCompare(a.date)
    })
  }, [records, query, typeFilter, sort])

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const current = Math.min(page, pageCount - 1)
  const visible = rows.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'date' ? 'desc' : 'asc' }))
    setPage(0)
  }

  return (
    <Panel
      title="Incident records"
      subtitle="Synthetic records — click a row for details"
      icon={<Table2 className="h-4 w-4" />}
      labels={
        <>
          <DataLabel kind="demo" />
          <DataLabel kind="not-official" />
        </>
      }
      bodyClassName="p-0"
    >
      <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
            placeholder="Search ID, region, type, source…"
            aria-label="Search incident records"
            className="h-10 w-full rounded-lg border border-white/[0.09] bg-ink-950/70 pl-9 pr-9 text-[13px] text-slate-200 placeholder:text-slate-500 hover:border-white/20 focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="sm:w-64">
          <Select
            id="table-type"
            label="Filter table by type"
            value={typeFilter}
            onChange={(v) => {
              setTypeFilter(v)
              setPage(0)
            }}
            options={[{ value: 'all', label: 'All types' }, ...VIOLENCE_TYPES.map((t) => ({ value: t, label: VIOLENCE_TYPE_LABEL[t] }))]}
          />
        </div>
        <span className="tabular text-xs text-slate-400 sm:ml-2">{formatNumber(rows.length)} records</span>
      </div>

      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.015]">
              {COLUMNS.map((c) => {
                const active = sort.key === c.key
                const Icon = active ? (sort.dir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                    className="px-4 py-2.5"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className={cn(
                        'inline-flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] transition-colors',
                        active ? 'text-blue-300' : 'text-slate-500 hover:text-slate-300',
                      )}
                    >
                      {c.label}
                      <Icon className="h-3 w-3" aria-hidden />
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {isUpdating ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-white/[0.04]">
                  {COLUMNS.map((c) => (
                    <td key={c.key} className="px-4 py-3">
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.015 * i }}
                    tabIndex={0}
                    onClick={() => selectIncident(r)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        selectIncident(r)
                      }
                    }}
                    aria-label={`Open details for incident ${r.id}`}
                    className="group cursor-pointer border-b border-white/[0.04] transition-colors hover:bg-blue-500/[0.05] focus-visible:bg-blue-500/[0.08] focus-visible:outline-none"
                  >
                    <td className="tabular whitespace-nowrap px-4 py-3 font-mono text-[12px] text-slate-300">
                      <span className="block">{r.date}</span>
                      <span className="text-[10px] text-slate-600 group-hover:text-slate-500">{r.id}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-200">{REGION_BY_ID[r.region].name}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex items-center gap-2 text-slate-200">
                        <span className="h-2 w-2 rounded-sm" style={{ background: VIOLENCE_TYPE_COLOR[r.type] }} aria-hidden />
                        {VIOLENCE_TYPE_LABEL[r.type]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-400">{victimGroupLabel(r)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-400">{SOURCE_TYPE_LABEL[r.sourceType]}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <VerificationBadge level={r.verification} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge tone={STATUS_TONE[r.status]} dot>
                        {STATUS_LABEL[r.status]}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
        {!isUpdating && !rows.length && <EmptyState message={query ? 'No records match your search.' : undefined} />}
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-3 sm:flex-row">
        <p className="tabular text-xs text-slate-500">
          {rows.length
            ? `Showing ${current * PAGE_SIZE + 1}–${Math.min(rows.length, (current + 1) * PAGE_SIZE)} of ${formatNumber(rows.length)}`
            : 'No records'}
        </p>
        <nav className="flex items-center gap-1" aria-label="Table pagination">
          <button
            type="button"
            onClick={() => setPage(current - 1)}
            disabled={current === 0}
            className="rounded-lg border border-white/[0.08] p-1.5 text-slate-400 hover:bg-white/[0.05] hover:text-white disabled:pointer-events-none disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="tabular px-3 text-xs text-slate-400">
            Page <span className="font-medium text-slate-200">{current + 1}</span> of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage(current + 1)}
            disabled={current >= pageCount - 1}
            className="rounded-lg border border-white/[0.08] p-1.5 text-slate-400 hover:bg-white/[0.05] hover:text-white disabled:pointer-events-none disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </Panel>
  )
}
