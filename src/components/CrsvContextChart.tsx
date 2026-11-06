import { motion } from 'framer-motion'
import { freshness, menBoys, womenGirls } from '../data/derive'
import type { CrsvContext, DashboardData, DatasetId } from '../data/types'
import { fmt, fmtDate, pct } from '../utils/format'
import { Card } from './Card'
import { SourceTag } from './SourceTag'

const ORDER: CrsvContext['id'][] = ['civ-residential', 'civ-detention', 'pow', 'pre-2022', 'ua-detainees', 'ua-pow']

function Bar({ c, max, i }: { c: CrsvContext; max: number; i: number }) {
  const wg = womenGirls(c)
  const mb = menBoys(c)
  const total = wg + mb
  const width = (total / max) * 100
  return (
    <li className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,210px)_minmax(0,1fr)] sm:items-center sm:gap-3">
      <span className="text-[12.5px] leading-snug text-ink">{c.label}</span>
      <div className="flex items-center gap-2">
        <div className="flex h-3.5 min-w-0 flex-1 items-center">
          <motion.div
            className="flex h-full gap-[2px]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(width, 1.5)}%` }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.05, ease: 'easeOut' }}
            title={`${c.label}: ${fmt(wg)} mulheres e meninas, ${fmt(mb)} homens e meninos`}
          >
            {wg > 0 && <span className="h-full rounded-l-[4px] bg-sex" style={{ flexGrow: wg, minWidth: 3 }} />}
            {mb > 0 && <span className={`h-full rounded-r-[4px] bg-men ${wg ? '' : 'rounded-l-[4px]'}`} style={{ flexGrow: mb }} />}
          </motion.div>
        </div>
        <span className="tabular w-[92px] shrink-0 text-right text-[12px] text-ink-2">
          <strong className="font-semibold text-ink">{fmt(wg)}</strong> de {fmt(total)}
        </span>
      </div>
    </li>
  )
}

export function CrsvContextChart({
  data,
  updated,
  className = '',
}: {
  data: DashboardData
  updated: Partial<Record<DatasetId, number>>
  className?: string
}) {
  const { crsv } = data
  const byId = Object.fromEntries(crsv.contexts.map((c) => [c.id, c])) as Record<CrsvContext['id'], CrsvContext>
  const max = Math.max(...crsv.contexts.map((c) => womenGirls(c) + menBoys(c)))
  const residential = byId['civ-residential']
  const resWG = womenGirls(residential)
  const resTotal = resWG + menBoys(residential)
  const groups = (['russia', 'ukraine'] as const).map((p) => ({
    p,
    meta: crsv.byPerpetrator[p],
    rows: ORDER.map((id) => byId[id]).filter((c) => c && c.perpetrator === p),
  }))

  return (
    <Card
      id="violencia-sexual"
      title="Violência sexual documentada pela ONU: contexto e vítimas"
      subtitle={`${fmt(crsv.total)} casos de ${fmtDate(crsv.periodStart)} a ${fmtDate(crsv.periodEnd)}. Cada caso é uma pessoa sobrevivente e pode envolver vários episódios.`}
      className={className}
      delay={0.15}
      flash={!!updated['ohchr-crsv-report']}
      footer={
        <SourceTag
          source="ONU · ACNUDH, relatório temático A/HRC/63/CRP.2"
          period={`publicado em ${fmtDate(crsv.publishedAt)}`}
          anchor="ohchr-crsv-report"
          kind={freshness(crsv.publishedAt)}
          justUpdated={!!updated['ohchr-crsv-report']}
        />
      }
    >
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Fact
          value={pct(resWG, resTotal)}
          text={`das vítimas fora de prisões, em áreas ocupadas, eram mulheres e meninas (${fmt(resWG)} de ${fmt(resTotal)})`}
        />
        <Fact
          value={fmt(crsv.rapeWomenGirls.total)}
          text={`mulheres e meninas sofreram estupro; ${fmt(crsv.rapeWomenGirls.gangRape)} por mais de um agressor`}
        />
        <Fact
          value={`${crsv.rapeAgeRange.min} a ${crsv.rapeAgeRange.max} anos`}
          text="idades das vítimas de estupro documentadas fora de detenção"
        />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-ink-2">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sex" aria-hidden /> mulheres e meninas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-men" aria-hidden /> homens e meninos
        </span>
        <span className="text-ink-3">comprimento da barra = total de casos no contexto</span>
      </div>

      <div className="space-y-4">
        {groups.map(({ p, meta, rows }, gi) => (
          <div key={p}>
            <h3 className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">
              Atribuídos a {meta.label.toLowerCase()} · {fmt(meta.total)} casos
            </h3>
            <ul className="space-y-2.5">
              {rows.map((c, i) => (
                <Bar key={c.id} c={c} max={max} i={gi * 4 + i} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[12px] leading-snug text-ink-2">
        A maior parte dos casos documentados atinge homens presos, sobretudo prisioneiros de guerra. Fora das prisões, nas áreas ocupadas,
        quase todas as vítimas foram mulheres e meninas.
      </p>
    </Card>
  )
}

function Fact({ value, text }: { value: string; text: string }) {
  return (
    <div className="rounded-xl bg-card-2 px-3 py-2.5">
      <p className="text-[24px] font-bold leading-tight text-ink">{value}</p>
      <p className="mt-0.5 text-[11.5px] leading-snug text-ink-2">{text}</p>
    </div>
  )
}
