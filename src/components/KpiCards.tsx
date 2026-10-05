import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { Kpis } from '../utils/stats'
import { CountUp } from './CountUp'

function Kpi({ label, value, accent, index }: { label: string; value: ReactNode; accent: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="relative overflow-hidden rounded-2xl border border-line bg-card px-4 py-3"
    >
      <span className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r ${accent}`} aria-hidden />
      <p className="text-[11px] font-semibold uppercase leading-snug tracking-[0.12em] text-ink-2 lg:min-h-[2lh]">{label}</p>
      <p className="tabular text-[30px] font-bold leading-tight tracking-tight text-white">{value}</p>
      <p className="text-[10.5px] text-ink-3">Dados ilustrativos</p>
    </motion.div>
  )
}

export function KpiCards({ kpis }: { kpis: Kpis }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi index={0} label="Incidentes documentados" accent="bg-lilac" value={<CountUp value={kpis.total} />} />
      <Kpi index={1} label="Violência sexual relacionada ao conflito" accent="bg-alert" value={<CountUp value={kpis.sexual} />} />
      <Kpi index={2} label="Regiões representadas" accent="bg-rose" value={<CountUp value={kpis.regions} />} />
      <Kpi index={3} label="Período" accent="bg-violet" value={`${kpis.firstYear} → ${kpis.lastYear}`} />
    </div>
  )
}
