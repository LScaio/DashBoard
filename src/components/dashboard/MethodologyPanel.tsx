import { BookOpenCheck } from 'lucide-react'
import { DataLabel } from '../ui/DataLabel'
import { Panel } from '../ui/Panel'

const POINTS = [
  'Documented incidents are not equivalent to total incidents.',
  'Reporting intensity varies by region.',
  'Conflict conditions affect access to victims and evidence.',
  'Some cases may remain unreported.',
  'Different sources use different definitions.',
  'Data should be interpreted with methodological caution.',
]

export function MethodologyPanel() {
  return (
    <Panel
      title="How to read this dashboard"
      subtitle="Six principles for interpreting the figures"
      icon={<BookOpenCheck className="h-4 w-4" />}
      labels={<DataLabel kind="limitations" />}
    >
      <ol className="space-y-3">
        {POINTS.map((p, i) => (
          <li key={p} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-blue-400/20 bg-blue-500/10 font-mono text-[11px] font-semibold text-blue-300">
              {i + 1}
            </span>
            <span className="pt-0.5 text-[13px] leading-relaxed text-slate-300">{p}</span>
          </li>
        ))}
      </ol>
    </Panel>
  )
}
