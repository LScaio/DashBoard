import { motion } from 'framer-motion'
import { CalendarRange, Database, Eye, Gauge, Library } from 'lucide-react'
import type { ReactNode } from 'react'
import { useDashboard } from '../../context/dashboardStore'
import { VERIFICATION_LABEL, VERIFICATION_LEVELS } from '../../data/labels'
import { confirmedShare, verificationBreakdown } from '../../utils/analytics'
import { formatDate } from '../../utils/date'
import { formatNumber } from '../../utils/format'

const VERIFICATION_BAR: Record<string, string> = {
  verified: 'bg-emerald-400',
  corroborated: 'bg-blue-400',
  reported: 'bg-amber-400',
  unverified: 'bg-slate-500',
}

function Row({ icon, question, children, delay }: { icon: ReactNode; question: string; children: ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-3 py-3.5 first:pt-0 last:pb-0"
    >
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-slate-400">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">{question}</p>
        <div className="mt-1 text-[13px] leading-relaxed text-slate-300">{children}</div>
      </div>
    </motion.div>
  )
}

/** Answers the five orientation questions a first-time viewer has. */
export function BriefingPanel() {
  const { records, filters } = useDashboard()
  const breakdown = verificationBreakdown(records)
  const confirmed = confirmedShare(records)

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="glass flex flex-col rounded-2xl border border-white/[0.07] p-6"
      aria-label="Briefing"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-slate-400">Briefing</p>
        <span className="font-mono text-[10px] text-slate-500">5 questions</span>
      </div>
      <div className="divide-y divide-white/[0.06]">
        <Row icon={<Eye className="h-3.5 w-3.5" />} question="What am I seeing?" delay={0.3}>
          A prototype analysis of <strong className="font-medium text-slate-100">documented violence against women and girls</strong> linked
          to the war in Ukraine — by time, place, type and victim profile.
        </Row>
        <Row icon={<CalendarRange className="h-3.5 w-3.5" />} question="Which period?" delay={0.4}>
          <span className="tabular text-slate-100">
            {formatDate(filters.dateFrom)} – {formatDate(filters.dateTo)}
          </span>
        </Row>
        <Row icon={<Database className="h-3.5 w-3.5" />} question="What is the scale?" delay={0.5}>
          <span className="tabular font-medium text-slate-100">{formatNumber(records.length)}</span> documented records in the selection.{' '}
          <span className="text-amber-300/90">Demonstration data — not the real scale.</span>
        </Row>
        <Row icon={<Library className="h-3.5 w-3.5" />} question="Where does the data come from?" delay={0.6}>
          A synthetic dataset. Real institutional sources are listed as{' '}
          <a href="#sources" className="text-blue-300 underline-offset-2 hover:underline">
            potential data sources
          </a>
          , not integrated.
        </Row>
        <Row icon={<Gauge className="h-3.5 w-3.5" />} question="How confident is it?" delay={0.7}>
          <span className="tabular font-medium text-slate-100">{confirmed.toFixed(0)}%</span> verified or corroborated.
          <div className="mt-2 flex h-1.5 gap-[2px] overflow-hidden rounded-full" role="img" aria-label="Verification mix">
            {breakdown.map((b) =>
              b.count ? (
                <div
                  key={b.key}
                  className={VERIFICATION_BAR[b.key]}
                  style={{ width: `${b.pct}%` }}
                  title={`${VERIFICATION_LABEL[b.key]}: ${b.pct.toFixed(0)}%`}
                />
              ) : null,
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {VERIFICATION_LEVELS.map((v) => (
              <span key={v} className="inline-flex items-center gap-1 text-[10.5px] text-slate-400">
                <span className={`h-1.5 w-1.5 rounded-full ${VERIFICATION_BAR[v]}`} aria-hidden />
                {VERIFICATION_LABEL[v]}
              </span>
            ))}
          </div>
        </Row>
      </div>
    </motion.aside>
  )
}
