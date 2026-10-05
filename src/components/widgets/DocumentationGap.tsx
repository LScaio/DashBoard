import { motion } from 'framer-motion'
import { useDashboard } from '../../state/dashboardStore'
import { fmt } from '../../utils/format'
import { Card } from '../ui/Card'

/** Conceptual indicator — the unknown part is deliberately NOT quantified. */
export function DocumentationGap({ className }: { className?: string }) {
  const { records } = useDashboard()
  return (
    <Card title="Documentation gap" subtitle="Conceptual indicator" className={className}>
      <div className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-baseline justify-between text-[10.5px] font-semibold uppercase tracking-wider">
            <span className="text-ink-2">Documented</span>
            <span className="tabular text-white">{fmt(records.length)}</span>
          </div>
          <div className="h-3 overflow-hidden rounded bg-white/[0.04]">
            <motion.div
              className="h-full rounded bg-primary"
              initial={{ width: 0 }}
              animate={{ width: '40%' }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex items-baseline justify-between text-[10.5px] font-semibold uppercase tracking-wider">
            <span className="text-ink-2">Unknown / underreported</span>
            <span className="text-ink-3">not quantified</span>
          </div>
          <div className="h-3 rounded bg-[repeating-linear-gradient(135deg,rgba(124,131,253,0.35)_0_5px,rgba(124,131,253,0.08)_5px_10px)] ring-1 ring-inset ring-primary/20" />
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink-2">Documented cases do not represent the total number of incidents.</p>
      <p className="mt-1 text-[10.5px] text-ink-3">Bar lengths are illustrative; no underreporting rate is estimated.</p>
    </Card>
  )
}
