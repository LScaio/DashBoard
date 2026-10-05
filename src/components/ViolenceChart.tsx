import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { TYPE_LABEL } from '../data/labels'
import type { Incident } from '../types'
import { countsByType, fmt } from '../utils/stats'
import { Card } from './Card'

/** Horizontal bars — sorted for quick reading. Red marks sexual violence only. */
export function ViolenceChart({ records, className }: { records: Incident[]; className?: string }) {
  const data = useMemo(() => countsByType(records).sort((a, b) => b.count - a.count), [records])
  const max = Math.max(...data.map((d) => d.count))
  const total = records.length

  return (
    <Card title="Tipos de violência registrados" className={className} delay={0.2}>
      <ul className="flex h-full flex-col justify-between gap-2.5">
        {data.map((d, i) => (
          <li key={d.type} className="group" title={`${TYPE_LABEL[d.type]}: ${fmt(d.count)} registros`}>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="text-ink transition-colors group-hover:text-white">{TYPE_LABEL[d.type]}</span>
              <span className="tabular text-ink-2">
                <span className="font-semibold text-ink">{fmt(d.count)}</span> · {((d.count / total) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
              <motion.div
                className={`h-full rounded-full ${d.type === 'sexual' ? 'bg-alert' : 'bg-lilac'} transition-opacity group-hover:opacity-80`}
                initial={{ width: 0 }}
                animate={{ width: `${(d.count / max) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.05, ease: 'easeOut' }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
