import { motion } from 'framer-motion'
import { freshness } from '../data/derive'
import type { CasualtyGroups, DashboardData, DatasetId } from '../data/types'
import { fmt, fmtDate, fmtMonthLong, pct } from '../utils/format'
import { Card } from './Card'
import { FreshnessBadge, SourceTag } from './SourceTag'

const SEGMENTS = [
  { key: 'women', label: 'Mulheres', color: 'var(--phys)' },
  { key: 'girls', label: 'Meninas', color: 'var(--phys-2)' },
  { key: 'men', label: 'Homens', color: 'var(--men)' },
  { key: 'boys', label: 'Meninos', color: 'var(--men-2)' },
  { key: 'unknown', label: 'Sexo ainda não identificado', color: 'var(--unknown)' },
] as const

type SegKey = (typeof SEGMENTS)[number]['key']
const valueOf = (g: CasualtyGroups, k: SegKey) => (k === 'unknown' ? g.adultsUnknown + g.childrenUnknown : g[k])

function SegmentedBar({ label, groups, delay }: { label: string; groups: CasualtyGroups; delay: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-[12.5px]">
        <span className="font-semibold text-ink">{label}</span>
        <span className="tabular text-ink-2">{fmt(groups.total)} civis</span>
      </div>
      <motion.div
        className="flex h-7 gap-[2px] overflow-hidden rounded-[4px]"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 0.9, delay, ease: 'easeOut' }}
        role="img"
        aria-label={`${label}: ${SEGMENTS.map((s) => `${s.label} ${fmt(valueOf(groups, s.key))}`).join(', ')}`}
      >
        {SEGMENTS.map((s) => {
          const v = valueOf(groups, s.key)
          const share = v / groups.total
          return (
            <span
              key={s.key}
              className="flex h-full items-center justify-center overflow-visible text-[11px] font-semibold"
              style={{ flexGrow: v, background: s.color, color: s.key === 'women' ? '#fff' : 'var(--ink)' }}
              title={`${s.label}: ${fmt(v)} (${pct(v, groups.total)})`}
            >
              {share >= 0.12 ? pct(v, groups.total) : ''}
            </span>
          )
        })}
      </motion.div>
    </div>
  )
}

export function CasualtiesBySex({
  data,
  updated,
  className = '',
}: {
  data: DashboardData
  updated: Partial<Record<DatasetId, number>>
  className?: string
}) {
  const { casualties: cas } = data
  const { killed, injured } = cas.cumulative
  const lm = cas.latestMonth
  const kind = freshness(cas.publishedAt)
  const justUpdated = !!updated['ohchr-civilian-casualties']

  return (
    <Card
      id="vitimas-por-sexo"
      title="Vítimas civis por sexo e idade"
      subtitle={`Pessoas civis mortas e feridas em ataques, verificadas pela ONU de ${fmtDate(cas.periodStart)} a ${fmtDate(cas.periodEnd)}`}
      className={className}
      delay={0.2}
      flash={justUpdated}
      footer={
        <SourceTag
          source="ONU · ACNUDH (HRMMU), atualização mensal"
          period={`publicada em ${fmtDate(cas.publishedAt)}`}
          anchor="ohchr-civilian-casualties"
          kind={kind}
          justUpdated={justUpdated}
        />
      }
    >
      <div className="space-y-4">
        <SegmentedBar label="Mortos" groups={killed} delay={0.25} />
        <SegmentedBar label="Feridos" groups={injured} delay={0.35} />
      </div>

      <table className="mt-4 w-full text-[12.5px]">
        <caption className="sr-only">Vítimas civis por sexo e idade</caption>
        <thead className="text-[11px] uppercase tracking-wide text-ink-3">
          <tr>
            <th scope="col" className="pb-1 text-left font-semibold">
              Grupo
            </th>
            <th scope="col" className="pb-1 text-right font-semibold">
              Mortos
            </th>
            <th scope="col" className="pb-1 text-right font-semibold">
              Feridos
            </th>
          </tr>
        </thead>
        <tbody>
          {SEGMENTS.map((s) => (
            <tr key={s.key} className="border-t border-line">
              <th scope="row" className="py-1 text-left font-normal text-ink">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm ring-1 ring-line" style={{ background: s.color }} aria-hidden />
                  {s.label}
                </span>
              </th>
              <td className="tabular py-1 text-right text-ink">{fmt(valueOf(killed, s.key))}</td>
              <td className="tabular py-1 text-right text-ink">{fmt(valueOf(injured, s.key))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 rounded-xl bg-recent-soft/60 px-3 py-2.5 ring-1 ring-recent/20">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-2">Mês mais recente: {fmtMonthLong(lm.month)}</p>
          <FreshnessBadge kind={kind} justUpdated={justUpdated} />
        </div>
        <p className="mt-1 text-[13px] leading-snug text-ink">
          <strong className="font-semibold">{fmt(lm.killed.women + lm.killed.girls)}</strong> mulheres e meninas mortas e{' '}
          <strong className="font-semibold">{fmt(lm.injured.women + lm.injured.girls)}</strong> feridas, entre {fmt(lm.killed.total)} civis
          mortos e {fmt(lm.injured.total)} feridos no mês.
        </p>
      </div>
    </Card>
  )
}
