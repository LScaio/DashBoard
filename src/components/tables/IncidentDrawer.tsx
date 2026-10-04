import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, FileSearch, Link2Off, ShieldCheck, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useDashboard } from '../../context/dashboardStore'
import {
  AGE_GROUP_LABEL,
  CIVILIAN_STATUS_LABEL,
  CONTEXT_LABEL,
  SOURCE_TYPE_LABEL,
  STATUS_LABEL,
  VERIFICATION_DESCRIPTION,
  VIOLENCE_TYPE_COLOR,
  VIOLENCE_TYPE_LABEL,
} from '../../data/labels'
import { REGION_BY_ID } from '../../data/regions'
import { formatDateLong } from '../../utils/date'
import { Badge } from '../ui/Badge'
import { DataLabel } from '../ui/DataLabel'
import { VerificationBadge } from '../ui/VerificationBadge'
import { STATUS_TONE } from './tableColumns'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[130px_minmax(0,1fr)] items-start gap-3 py-3">
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}</dt>
      <dd className="text-[13px] text-slate-200">{children}</dd>
    </div>
  )
}

export function IncidentDrawer() {
  const { selectedIncident: r, selectIncident } = useDashboard()
  // Keyed by incident id so the source notice resets when another record is opened.
  const [sourceOpenFor, setSourceOpenFor] = useState<string | null>(null)
  const sourceOpen = !!r && sourceOpenFor === r.id
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!r) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && selectIncident(null)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [r, selectIncident])

  return (
    <AnimatePresence>
      {r && (
        <>
          <motion.div
            className="no-print fixed inset-0 z-[70] bg-black/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => selectIncident(null)}
            aria-hidden
          />
          <motion.aside
            key={r.id}
            role="dialog"
            aria-modal="true"
            aria-labelledby="incident-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="no-print fixed inset-y-0 right-0 z-[71] flex w-full max-w-[480px] flex-col border-l border-white/[0.08] bg-ink-900/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-6 py-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Incident record</p>
                <h2 id="incident-title" className="mt-1 font-mono text-lg font-semibold text-white">
                  {r.id}
                </h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <DataLabel kind="demo" />
                  <DataLabel kind="not-official" />
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => selectIncident(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.05] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
                aria-label="Close incident details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="scrollbar-thin flex-1 overflow-y-auto px-6 py-2">
              <dl className="divide-y divide-white/[0.05]">
                <Field label="Incident ID">
                  <span className="font-mono">{r.id}</span>
                </Field>
                <Field label="Date">{formatDateLong(r.date)}</Field>
                <Field label="Region">{REGION_BY_ID[r.region].name}</Field>
                <Field label="Type">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-sm" style={{ background: VIOLENCE_TYPE_COLOR[r.type] }} aria-hidden />
                    {VIOLENCE_TYPE_LABEL[r.type]}
                  </span>
                </Field>
                <Field label="Context">{CONTEXT_LABEL[r.context]}</Field>
                <Field label="Victim group">
                  {AGE_GROUP_LABEL[r.ageGroup]} · {CIVILIAN_STATUS_LABEL[r.civilianStatus]}
                </Field>
                <Field label="Source">{SOURCE_TYPE_LABEL[r.sourceType]}</Field>
                <Field label="Verification">
                  <VerificationBadge level={r.verification} />
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-500">{VERIFICATION_DESCRIPTION[r.verification]}</p>
                </Field>
                <Field label="Documentation">
                  <Badge tone={STATUS_TONE[r.status]} dot>
                    {STATUS_LABEL[r.status]}
                  </Badge>
                </Field>
              </dl>

              <div className="mt-4 flex gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden />
                <p className="text-[12px] leading-relaxed text-slate-300">
                  Survivor-centred record: no names, addresses, contact details, identifying information or graphic descriptions are stored
                  or displayed.
                </p>
              </div>

              <AnimatePresence>
                {sourceOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 rounded-xl border border-blue-400/20 bg-blue-500/[0.06] p-4" role="status">
                      <div className="flex items-center gap-2">
                        <Link2Off className="h-4 w-4 text-blue-300" aria-hidden />
                        <p className="text-[13px] font-medium text-slate-100">Source link not connected</p>
                      </div>
                      <p className="mt-2 text-[12px] leading-relaxed text-slate-400">
                        In a production system, this button would open the original source document (
                        {SOURCE_TYPE_LABEL[r.sourceType].toLowerCase()}) with access controls appropriate to its sensitivity. This prototype
                        uses synthetic records, so no source exists.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-2 border-t border-white/[0.06] px-6 py-4">
              <button
                type="button"
                onClick={() => setSourceOpenFor(sourceOpen ? null : r.id)}
                aria-expanded={sourceOpen}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 text-[13px] font-semibold text-white hover:bg-blue-500"
              >
                {sourceOpen ? <FileSearch className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                View source
              </button>
              <button
                type="button"
                onClick={() => selectIncident(null)}
                className="h-10 rounded-lg border border-white/[0.09] px-4 text-[13px] font-medium text-slate-300 hover:bg-white/[0.04]"
              >
                Close
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
