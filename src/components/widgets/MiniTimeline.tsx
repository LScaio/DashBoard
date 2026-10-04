import { Card } from '../ui/Card'

/** Generic phases only — no specific events are asserted. */
const POINTS = [
  { year: '2022', label: 'Full-scale invasion', note: '24 Feb 2022' },
  { year: '2022–23', label: 'Major displacement', note: 'Generic phase' },
  { year: '2023–24', label: 'International investigations', note: 'Generic phase' },
  { year: '2024–25', label: 'Reporting periods', note: 'Periodic documentation' },
  { year: '2026', label: 'Present', note: 'Ongoing reporting' },
]

export function MiniTimeline({ className }: { className?: string }) {
  return (
    <Card title="Timeline" subtitle="Generic phases for context — not specific events" className={className}>
      <div className="scroll-thin overflow-x-auto pb-1">
        <ol className="relative grid min-w-[520px] grid-cols-5">
          <span className="absolute left-[10%] right-[10%] top-[7px] h-px bg-line-2" aria-hidden />
          {POINTS.map((p, i) => (
            <li key={p.label} className="relative flex flex-col items-center px-1 text-center">
              <span
                className={`relative h-3.5 w-3.5 rounded-full border-2 ${i === 0 ? 'border-alert bg-alert/30' : i === POINTS.length - 1 ? 'border-primary bg-primary/30' : 'border-line-2 bg-panel'}`}
              />
              <span className="tabular mt-2 font-mono text-[11px] text-ink">{p.year}</span>
              <span className="mt-0.5 text-xs font-medium text-ink-2">{p.label}</span>
              <span className="text-[10.5px] text-ink-3">{p.note}</span>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  )
}
