import { Building2 } from 'lucide-react'
import { REFERENCE_SOURCES } from '../../data/sources'
import { VERIFICATIONS, VERIFICATION_LABEL } from '../../data/labels'
import { useDashboard } from '../../state/dashboardStore'
import { fmt, pct } from '../../utils/format'
import { Badge } from '../ui/Badge'
import { VERIFICATION_TONE } from '../ui/tones'
import { Card } from '../ui/Card'

const VERIFICATION_NOTE = {
  verified: 'Confirmed by a monitoring body applying a defined standard',
  corroborated: 'Supported by two or more independent sources',
  reported: 'Single credible source, not independently confirmed',
  unverified: 'Received, not yet assessed',
} as const

export function ReferenceSources({ className }: { className?: string }) {
  return (
    <Card title="Reference sources" subtitle="Not connected — no data from these organisations is used" className={className}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {REFERENCE_SOURCES.map((s) => (
          <div key={s.code} className="rounded-lg border border-line bg-panel-2 p-3.5">
            <div className="flex items-start justify-between gap-2">
              <Building2 className="h-4 w-4 text-ink-3" aria-hidden />
              <Badge tone="muted">Reference source</Badge>
            </div>
            <p className="mt-3 text-sm font-semibold text-white">{s.code}</p>
            <p className="mt-0.5 text-[11px] text-ink-3">{s.name}</p>
            <p className="mt-2 text-[11px] text-ink-2">{s.kind}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-ink-2">Future implementation could connect verified datasets from these organizations.</p>
    </Card>
  )
}

export function VerificationLevels({ className }: { className?: string }) {
  const { records } = useDashboard()
  return (
    <Card title="Verification levels" subtitle="Share of records in the current selection" className={className}>
      <ul className="space-y-3">
        {VERIFICATIONS.map((v) => {
          const n = records.filter((r) => r.verification === v).length
          return (
            <li key={v}>
              <div className="flex items-center justify-between">
                <Badge tone={VERIFICATION_TONE[v]}>{VERIFICATION_LABEL[v]}</Badge>
                <span className="tabular text-xs text-ink">
                  {fmt(n)} <span className="text-ink-3">· {records.length ? pct((n / records.length) * 100, 0) : '0%'}</span>
                </span>
              </div>
              <p className="mt-1 text-[11px] text-ink-3">{VERIFICATION_NOTE[v]}</p>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
