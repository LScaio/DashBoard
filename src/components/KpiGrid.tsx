import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { freshness, headline, type Freshness } from '../data/derive'
import type { DashboardData, DatasetId } from '../data/types'
import { fmt, fmtCompact, fmtDate, pct } from '../utils/format'
import { CountUp } from './CountUp'
import { FreshnessBadge } from './SourceTag'

interface KpiProps {
  index: number
  label: string
  value: ReactNode
  context: ReactNode
  detail: ReactNode
  source: string
  anchor: string
  accent: string
  kind: Freshness
  justUpdated?: boolean
}

function Kpi({ index, label, value, context, detail, source, anchor, accent, kind, justUpdated }: KpiProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 + index * 0.05 }}
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card px-4 pb-3 pt-4 shadow-sm shadow-black/[0.03] ${justUpdated ? 'flash-update' : ''}`}
    >
      <span className={`absolute bottom-4 left-0 top-4 w-[3px] rounded-r ${accent}`} aria-hidden />
      <h3 className="text-[12.5px] font-semibold leading-snug text-ink-2">{label}</h3>
      <p className="mt-1.5 text-[34px] font-bold leading-none tracking-tight text-ink sm:text-[38px]">{value}</p>
      <p className="mt-2 text-[12.5px] leading-snug text-ink-2">{context}</p>
      <p className="mt-0.5 text-[11.5px] leading-snug text-ink-3">{detail}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 text-[11px] text-ink-3">
        <a href={`fontes.html#${anchor}`} className="underline-offset-2 hover:text-ink hover:underline">
          {source}
        </a>
        <FreshnessBadge kind={kind} justUpdated={justUpdated} />
      </div>
    </motion.article>
  )
}

interface KpiGridProps {
  data: DashboardData
  updated: Partial<Record<DatasetId, number>>
  displacementLive: boolean
  className?: string
}

export function KpiGrid({ data, updated, displacementLive, className = '' }: KpiGridProps) {
  const h = headline(data)
  const { casualties: cas, crsv, displacement: disp } = data
  const { killed, injured } = cas.cumulative
  const { refugees, idps, year } = disp.latest
  const casKind = freshness(cas.publishedAt)

  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${className}`}>
      <Kpi
        index={0}
        label="Mulheres e meninas mortas"
        value={<CountUp value={h.killedWG} />}
        context={
          <>
            <strong className="font-semibold text-ink">{pct(h.killedWG, h.killedTotal)}</strong> dos {fmt(h.killedTotal)} civis mortos
            verificados pela ONU
          </>
        }
        detail={`${fmt(killed.women)} mulheres · ${fmt(killed.girls)} meninas · 24/02/2022 a ${fmtDate(cas.periodEnd)}`}
        source="ONU · ACNUDH (HRMMU)"
        anchor="ohchr-civilian-casualties"
        accent="bg-phys"
        kind={casKind}
        justUpdated={!!updated['ohchr-civilian-casualties']}
      />
      <Kpi
        index={1}
        label="Mulheres e meninas feridas"
        value={<CountUp value={h.injuredWG} />}
        context={
          <>
            <strong className="font-semibold text-ink">{pct(h.injuredWG, h.injuredTotal)}</strong> dos {fmt(h.injuredTotal)} civis feridos
            verificados pela ONU
          </>
        }
        detail={`${fmt(injured.women)} mulheres · ${fmt(injured.girls)} meninas · 24/02/2022 a ${fmtDate(cas.periodEnd)}`}
        source="ONU · ACNUDH (HRMMU)"
        anchor="ohchr-civilian-casualties"
        accent="bg-phys"
        kind={casKind}
        justUpdated={!!updated['ohchr-civilian-casualties']}
      />
      <Kpi
        index={2}
        label="Mulheres e meninas sobreviventes de violência sexual"
        value={<CountUp value={h.crsvWG} />}
        context={
          <>
            <strong className="font-semibold text-ink">{pct(h.crsvWG, h.crsvTotal)}</strong> dos {fmt(h.crsvTotal)} casos documentados pela
            ONU (todas as vítimas)
          </>
        }
        detail={`${fmt(crsv.rapeWomenGirls.total)} delas sofreram estupro · 24/02/2022 a ${fmtDate(crsv.periodEnd)}`}
        source="ONU · ACNUDH, relatório A/HRC/63/CRP.2"
        anchor="ohchr-crsv-report"
        accent="bg-sex"
        kind={freshness(crsv.publishedAt)}
        justUpdated={!!updated['ohchr-crsv-report']}
      />
      <Kpi
        index={3}
        label="Mulheres e meninas deslocadas pela guerra"
        value={<CountUp value={h.displacedFemale} format={(n) => fmtCompact(Math.round(n))} />}
        context={
          <>
            <strong className="font-semibold text-ink">{fmtCompact(refugees.female)}</strong> refugiadas fora do país e{' '}
            <strong className="font-semibold text-ink">{fmtCompact(idps.female)}</strong> deslocadas dentro da Ucrânia
          </>
        }
        detail={`Situação em 31/12/${year} · ${pct(h.displacedFemale, h.displacedSexKnown)} das pessoas deslocadas com sexo informado`}
        source="ACNUR (agência da ONU para refugiados)"
        anchor="unhcr-displacement"
        accent="bg-disp"
        kind={displacementLive ? 'live' : 'historical'}
        justUpdated={!!updated['unhcr-displacement']}
      />
    </div>
  )
}
