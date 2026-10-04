import { AnimatePresence, motion } from 'framer-motion'
import { CircleCheck, Lightbulb, MapPin, ShieldAlert, TrendingUp, TriangleAlert } from 'lucide-react'
import { useMemo } from 'react'
import { useDashboard } from '../../context/dashboardStore'
import { REGION_BY_ID } from '../../data/regions'
import type { RegionId } from '../../types'
import { buildObservations, type Observation } from '../../utils/analytics'
import { cn } from '../../utils/format'
import { DataLabel } from '../ui/DataLabel'
import { EmptyState } from '../ui/EmptyState'
import { Panel } from '../ui/Panel'

const TONE: Record<Observation['tone'], string> = {
  neutral: 'border-white/[0.07] text-blue-300',
  alert: 'border-red-400/15 text-red-300',
  caution: 'border-amber-400/15 text-amber-300',
  positive: 'border-emerald-400/15 text-emerald-300',
}

const ICON: Record<string, typeof Lightbulb> = {
  trend: TrendingUp,
  region: MapPin,
  crsv: ShieldAlert,
  verification: CircleCheck,
  displacement: TriangleAlert,
}

export function KeyObservations() {
  const { records, filters } = useDashboard()
  const items = useMemo(
    () => buildObservations(records, filters.dateFrom, filters.dateTo, (id) => REGION_BY_ID[id as RegionId].name),
    [records, filters.dateFrom, filters.dateTo],
  )

  return (
    <Panel
      title="Key observations"
      subtitle="Computed automatically from the current selection"
      icon={<Lightbulb className="h-4 w-4" />}
      labels={<DataLabel kind="generated" />}
    >
      {!items.length ? (
        <EmptyState />
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {items.map((o, i) => {
              const Icon = ICON[o.id] ?? Lightbulb
              return (
                <motion.li
                  key={o.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={cn(
                    'flex gap-3 rounded-xl border bg-ink-950/40 p-4',
                    TONE[o.tone],
                    i === 0 && items.length % 2 === 1 && 'md:col-span-2',
                  )}
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <div>
                    <p className="text-[13.5px] font-medium leading-snug text-slate-100">{o.title}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-400">{o.body}</p>
                  </div>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      )}
    </Panel>
  )
}
