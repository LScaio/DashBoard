import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { DEMO_DATA } from '../../data/demoData'
import { VIOLENCE_LABEL, VIOLENCE_NOTE } from '../../data/labels'
import { countByType } from '../../utils/stats'

/** Barras horizontais, uma por categoria, com uma frase que explica cada forma de violência. */
export function TypesChart() {
  const data = useMemo(() => countByType(DEMO_DATA), [])
  const max = Math.max(...data.map((d) => d.count))

  return (
    <ul className="space-y-6" aria-label="Registros demonstrativos por tipo de violência">
      {data.map((d, i) => (
        <motion.li key={d.type} className="group" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-display text-xl font-light text-white sm:text-2xl">{VIOLENCE_LABEL[d.type]}</span>
            <span className="tabular shrink-0 text-sm text-lilac-100/60">
              <span className="font-medium text-white">{d.count}</span> · {d.pct.toFixed(0)}%
            </span>
          </div>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-iris via-violet to-lilac-300"
              variants={{ hidden: { width: 0 }, show: { width: `${(d.count / max) * 100}%` } }}
              transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <p className="mt-2 text-sm text-lilac-100/45 transition-colors group-hover:text-lilac-100/80">{VIOLENCE_NOTE[d.type]}</p>
        </motion.li>
      ))}
    </ul>
  )
}
