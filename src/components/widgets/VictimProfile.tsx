import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { AGE_LABEL } from '../../data/labels'
import { useDashboard } from '../../state/dashboardStore'
import { fmt, pct } from '../../utils/format'
import { ageShares } from '../../utils/metrics'
import { Card } from '../ui/Card'
import { DemoTag } from '../ui/DemoTag'

export function VictimProfile({ className }: { className?: string }) {
  const { records } = useDashboard()
  const shares = useMemo(() => ageShares(records), [records])
  const known = shares.reduce((s, a) => s + a.count, 0)
  const max = Math.max(1, ...shares.map((s) => s.count))

  return (
    <Card title="Victim profile" subtitle="Age group of documented victims" className={className} actions={<DemoTag />}>
      <ul className="space-y-2.5" aria-label="Documented incidents by age group">
        {shares.map((s, i) => (
          <li key={s.key} className="grid grid-cols-[64px_1fr_92px] items-center gap-3 text-xs">
            <span className="text-ink-2">{AGE_LABEL[s.key]}</span>
            <div className="h-5 overflow-hidden rounded bg-white/[0.04]">
              <motion.div
                className="h-full rounded bg-gradient-to-r from-primary to-primary-2"
                initial={{ width: 0 }}
                animate={{ width: `${(s.count / max) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.04 }}
              />
            </div>
            <span className="tabular text-right text-ink">
              {fmt(s.count)} <span className="text-ink-3">· {pct(s.pct, 0)}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-line pt-3 text-[11px] text-ink-3">
        Age information available only for a subset of records:{' '}
        <span className="tabular text-ink-2">
          {fmt(known)} of {fmt(records.length)} ({records.length ? pct((known / records.length) * 100, 0) : '0%'})
        </span>
        .
      </p>
    </Card>
  )
}
