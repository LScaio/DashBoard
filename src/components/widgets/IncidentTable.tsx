import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SOURCE_LABEL, STATUS_LABEL, TYPE_LABEL, VERIFICATIONS, VERIFICATION_LABEL, VICTIM_LABEL } from '../../data/labels'
import { REGION_BY_ID } from '../../data/regions'
import { useDashboard } from '../../state/dashboardStore'
import type { Incident } from '../../types'
import { formatDate } from '../../utils/date'
import { cn, fmt } from '../../utils/format'
import { Badge } from '../ui/Badge'
import { STATUS_TONE, VERIFICATION_TONE } from '../ui/tones'
import { Card } from '../ui/Card'
import { DemoTag } from '../ui/DemoTag'

type SortKey = 'id' | 'date' | 'region' | 'type' | 'victim' | 'source' | 'verification' | 'status'

const COLUMNS: { key: SortKey; label: string; get: (r: Incident) => string | number }[] = [
  { key: 'id', label: 'ID', get: (r) => r.id },
  { key: 'date', label: 'Date', get: (r) => r.date },
  { key: 'region', label: 'Region', get: (r) => REGION_BY_ID[r.region].name },
  { key: 'type', label: 'Type', get: (r) => TYPE_LABEL[r.type] },
  { key: 'victim', label: 'Victim group', get: (r) => VICTIM_LABEL[r.victimGroup] },
  { key: 'source', label: 'Source', get: (r) => SOURCE_LABEL[r.source] },
  { key: 'verification', label: 'Verification', get: (r) => VERIFICATIONS.indexOf(r.verification) },
  { key: 'status', label: 'Status', get: (r) => STATUS_LABEL[r.status] },
]

const searchable = (r: Incident) =>
  `${r.id} ${r.date} ${formatDate(r.date)} ${REGION_BY_ID[r.region].name} ${TYPE_LABEL[r.type]} ${VICTIM_LABEL[r.victimGroup]} ${SOURCE_LABEL[r.source]} ${VERIFICATION_LABEL[r.verification]} ${STATUS_LABEL[r.status]}`.toLowerCase()

export function IncidentTable({ className, pageSize = 8 }: { className?: string; pageSize?: number }) {
  const { records, search, setSearch, select } = useDashboard()
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'date', dir: 'desc' })
  const [page, setPage] = useState(0)

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = q ? records.filter((r) => searchable(r).includes(q)) : records
    const col = COLUMNS.find((c) => c.key === sort.key)!
    return [...list].sort((a, b) => {
      const va = col.get(a)
      const vb = col.get(b)
      const c = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))
      return (sort.dir === 'asc' ? c : -c) || b.id.localeCompare(a.id)
    })
  }, [records, search, sort])

  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(page, pages - 1)
  const visible = rows.slice(current * pageSize, (current + 1) * pageSize)

  return (
    <Card
      title="Incident records"
      subtitle="Synthetic demonstration records · click a row for details"
      className={className}
      bodyClassName="p-0 pt-3"
      actions={
        <>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-3" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
              placeholder="Search ID, region, type…"
              aria-label="Search incident records"
              className="h-8 w-52 rounded-lg border border-line bg-panel-2 pl-8 pr-2 text-xs text-ink placeholder:text-ink-3 focus:border-primary/60 focus:outline-none"
            />
          </div>
          <DemoTag />
        </>
      }
    >
      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-xs">
          <thead>
            <tr className="border-y border-line bg-panel-2/60">
              {COLUMNS.map((c) => {
                const active = sort.key === c.key
                const Icon = active ? (sort.dir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown
                return (
                  <th
                    key={c.key}
                    scope="col"
                    className="px-4 py-2"
                    aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSort((s) =>
                          s.key === c.key ? { key: c.key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: c.key, dir: 'asc' },
                        )
                        setPage(0)
                      }}
                      className={cn(
                        'inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider',
                        active ? 'text-primary' : 'text-ink-3 hover:text-ink',
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
            {visible.map((r) => (
              <tr
                key={r.id}
                tabIndex={0}
                onClick={() => select(r)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), select(r))}
                className="cursor-pointer border-b border-line/70 transition-colors hover:bg-primary/[0.06] focus-visible:bg-primary/[0.1] focus-visible:outline-none"
              >
                <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[11px] text-primary">{r.id}</td>
                <td className="tabular whitespace-nowrap px-4 py-2.5 text-ink-2">{formatDate(r.date)}</td>
                <td className="whitespace-nowrap px-4 py-2.5 text-ink">{REGION_BY_ID[r.region].name}</td>
                <td className="whitespace-nowrap px-4 py-2.5">
                  <span className="inline-flex items-center gap-1.5 text-ink">
                    <span className={cn('h-1.5 w-1.5 rounded-full', r.type === 'sexual' ? 'bg-alert' : 'bg-primary')} aria-hidden />
                    {TYPE_LABEL[r.type]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-ink-2">{VICTIM_LABEL[r.victimGroup]}</td>
                <td className="whitespace-nowrap px-4 py-2.5 text-ink-2">{SOURCE_LABEL[r.source]}</td>
                <td className="px-4 py-2.5">
                  <Badge tone={VERIFICATION_TONE[r.verification]}>{VERIFICATION_LABEL[r.verification]}</Badge>
                </td>
                <td className="px-4 py-2.5">
                  <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="py-10 text-center text-xs text-ink-3">No records match the current filters or search.</p>}
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="tabular text-[11px] text-ink-3">
          {rows.length
            ? `${fmt(current * pageSize + 1)}–${fmt(Math.min(rows.length, (current + 1) * pageSize))} of ${fmt(rows.length)}`
            : '0 records'}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
            className="rounded-md border border-line p-1 text-ink-2 hover:text-white disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="tabular px-2 text-[11px] text-ink-3">
            {fmt(current + 1)} / {fmt(pages)}
          </span>
          <button
            type="button"
            disabled={current >= pages - 1}
            onClick={() => setPage(current + 1)}
            className="rounded-md border border-line p-1 text-ink-2 hover:text-white disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  )
}
