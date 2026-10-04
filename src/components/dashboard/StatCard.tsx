import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { Trend } from '../../types'
import { cn } from '../../utils/format'
import { CountUp } from '../ui/CountUp'
import { InfoTip } from '../ui/InfoTip'
import { TrendIndicator } from './TrendIndicator'

export type StatAccent = 'blue' | 'red' | 'amber' | 'slate'

const ACCENT: Record<StatAccent, { icon: string; glow: string }> = {
  blue: { icon: 'text-blue-300 bg-blue-500/10 border-blue-400/20', glow: 'from-blue-500/15' },
  red: { icon: 'text-red-300 bg-red-500/10 border-red-400/20', glow: 'from-red-500/10' },
  amber: { icon: 'text-amber-300 bg-amber-500/10 border-amber-400/20', glow: 'from-amber-500/10' },
  slate: { icon: 'text-slate-300 bg-slate-500/10 border-slate-400/20', glow: 'from-slate-400/10' },
}

interface StatCardProps {
  title: string
  value: number
  description: string
  icon: ReactNode
  trend?: Trend
  accent?: StatAccent
  footnote: string
  info?: string
  index?: number
}

export function StatCard({ title, value, description, icon, trend, accent = 'blue', footnote, info, index = 0 }: StatCardProps) {
  const a = ACCENT[accent]
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="glass group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] p-5 transition-colors hover:border-white/[0.14]"
    >
      <div
        className={cn(
          'pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-2xl transition-opacity group-hover:opacity-100',
          a.glow,
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <h3 className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate-400">{title}</h3>
          {info && <InfoTip content={info} label={`About ${title}`} />}
        </div>
        <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border', a.icon)}>{icon}</div>
      </div>
      <CountUp value={value} className="tabular relative mt-3 text-[32px] font-semibold leading-none tracking-tight text-white" />
      <p className="relative mt-2 text-[12.5px] leading-snug text-slate-400">{description}</p>
      <div className="relative mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-3 mt-4">
        {trend ? <TrendIndicator trend={trend} suffix="2nd vs 1st half" /> : <span className="text-xs text-slate-500">—</span>}
        <span
          className="inline-flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-amber-300/80"
          title="Demonstration data"
        >
          <span className="h-1 w-1 rounded-full bg-amber-400" aria-hidden />
          {footnote}
        </span>
      </div>
    </motion.article>
  )
}
