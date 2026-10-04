import { Library, ShieldCheck } from 'lucide-react'
import { useDashboard } from '../../context/dashboardStore'
import { VERIFICATION_DESCRIPTION, VERIFICATION_LABEL } from '../../data/labels'
import { POTENTIAL_SOURCES } from '../../data/sources'
import { verificationBreakdown } from '../../utils/analytics'
import { formatNumber } from '../../utils/format'
import { DataLabel } from '../ui/DataLabel'
import { Panel } from '../ui/Panel'
import { VerificationBadge } from '../ui/VerificationBadge'
import { SourceCard } from './SourceCard'

export function SourcesSection() {
  const { records } = useDashboard()
  const breakdown = verificationBreakdown(records)

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
      <Panel
        title="Potential data sources"
        subtitle="Institutions whose public reporting could feed a production version. No data from these sources is shown here."
        icon={<Library className="h-4 w-4" />}
        labels={<DataLabel kind="not-integrated" />}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
          {POTENTIAL_SOURCES.map((s, i) => (
            <SourceCard key={s.id} source={s} index={i} />
          ))}
        </div>
      </Panel>

      <Panel title="Data verification" subtitle="Confidence levels applied to each record" icon={<ShieldCheck className="h-4 w-4" />}>
        <ul className="space-y-4">
          {breakdown.map((b) => (
            <li key={b.key} className="rounded-xl border border-white/[0.06] bg-ink-950/40 p-3.5">
              <div className="flex items-center justify-between">
                <VerificationBadge level={b.key} />
                <span className="tabular text-xs text-slate-400">
                  <span className="font-medium text-slate-100">{formatNumber(b.count)}</span> · {b.pct.toFixed(0)}%
                </span>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-slate-400">{VERIFICATION_DESCRIPTION[b.key]}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
          Counts reflect the current selection of demonstration data. Levels: {Object.values(VERIFICATION_LABEL).join(' → ')} (highest to
          lowest confidence).
        </p>
      </Panel>
    </div>
  )
}
