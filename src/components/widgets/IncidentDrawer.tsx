import { AnimatePresence, motion } from 'framer-motion'
import { Info, X } from 'lucide-react'
import { useEffect } from 'react'
import { AGE_LABEL, SOURCE_LABEL, STATUS_LABEL, TYPE_LABEL, VERIFICATION_LABEL, VICTIM_LABEL } from '../../data/labels'
import { REGION_BY_ID } from '../../data/regions'
import { useDashboard } from '../../state/dashboardStore'
import { formatDate } from '../../utils/date'
import { Badge } from '../ui/Badge'
import { STATUS_TONE, VERIFICATION_TONE } from '../ui/tones'
import { DemoTag } from '../ui/DemoTag'

export function IncidentDrawer() {
  const { selected: r, select } = useDashboard()

  useEffect(() => {
    if (!r) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && select(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [r, select])

  return (
    <AnimatePresence>
      {r && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => select(null)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-line bg-panel shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-line px-5 py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">Incident</p>
                <h2 id="drawer-title" className="mt-0.5 font-mono text-lg font-semibold text-white">
                  {r.id}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => select(null)}
                className="rounded-md p-1.5 text-ink-3 hover:bg-white/5 hover:text-white"
                aria-label="Close"
                autoFocus
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <dl className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {(
                [
                  ['Date', formatDate(r.date)],
                  ['Region', REGION_BY_ID[r.region].name],
                  ['Type', TYPE_LABEL[r.type]],
                  ['Victim group', VICTIM_LABEL[r.victimGroup]],
                  ['Age group', r.ageGroup ? AGE_LABEL[r.ageGroup] : 'Not available'],
                  ['Source', SOURCE_LABEL[r.source]],
                  [
                    'Verification',
                    <Badge key="v" tone={VERIFICATION_TONE[r.verification]}>
                      {VERIFICATION_LABEL[r.verification]}
                    </Badge>,
                  ],
                  [
                    'Documentation status',
                    <Badge key="s" tone={STATUS_TONE[r.status]}>
                      {STATUS_LABEL[r.status]}
                    </Badge>,
                  ],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-3">{k}</dt>
                  <dd className="text-right text-[13px] text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="m-5 rounded-lg border border-warn/25 bg-warn/[0.06] p-3.5">
              <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-warn">
                <Info className="h-3.5 w-3.5" aria-hidden /> Data note
              </p>
              <p className="mt-1.5 text-xs text-ink-2">Demonstration record created for prototype purposes.</p>
              <div className="mt-2.5">
                <DemoTag />
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
