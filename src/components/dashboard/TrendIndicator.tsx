import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Trend } from '../../types'
import { cn, formatSignedPct } from '../../utils/format'

/**
 * Trend arrow. An increase in reported violence is marked in the alert colour;
 * this signals more records, which may reflect improved documentation.
 */
export function TrendIndicator({ trend, suffix, compact }: { trend: Trend; suffix?: string; compact?: boolean }) {
  const Icon = trend.direction === 'up' ? ArrowUpRight : trend.direction === 'down' ? ArrowDownRight : ArrowRight
  const color = trend.direction === 'up' ? 'text-red-300' : trend.direction === 'down' ? 'text-sky-300' : 'text-slate-400'
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium', color)}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      <span className="tabular">{formatSignedPct(trend.pct)}</span>
      {suffix && !compact && <span className="font-normal text-slate-500">{suffix}</span>}
    </span>
  )
}
