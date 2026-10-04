import { motion } from 'framer-motion'
import { EyeOff } from 'lucide-react'
import { DataLabel } from '../ui/DataLabel'
import { Panel } from '../ui/Panel'

/**
 * Conceptual visual — deliberately NOT quantitative. The band widths are
 * illustrative and do not encode any estimate.
 */
const LAYERS = [
  {
    key: 'known',
    label: 'Known',
    text: 'Documented, reported or independently verified incidents — what this dashboard can show.',
    bar: 'bg-blue-500',
  },
  {
    key: 'under',
    label: 'Underreported',
    text: 'Incidents known to someone (survivors, service providers, communities) but not formally recorded.',
    bar: 'bg-[repeating-linear-gradient(135deg,rgba(96,165,250,0.45)_0_6px,rgba(96,165,250,0.12)_6px_12px)]',
  },
  {
    key: 'unknown',
    label: 'Unknown',
    text: 'Incidents never disclosed — because of stigma, fear, lack of access, displacement or loss of evidence.',
    bar: 'bg-[repeating-linear-gradient(135deg,rgba(148,163,184,0.18)_0_2px,transparent_2px_8px)] ring-1 ring-inset ring-dashed ring-slate-500/30',
  },
]

export function DocumentationGap() {
  return (
    <Panel
      title="Documentation gap"
      subtitle="Reported cases ≠ total cases"
      icon={<EyeOff className="h-4 w-4" />}
      labels={<DataLabel kind="limitations" />}
    >
      <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-ink-950/40 px-4 py-3">
        <span className="font-mono text-sm font-semibold text-slate-100">Reported cases</span>
        <span className="font-mono text-lg text-red-300" aria-label="is not equal to">
          ≠
        </span>
        <span className="font-mono text-sm font-semibold text-slate-100">Total cases</span>
      </div>

      <div
        className="mt-5 space-y-4"
        role="img"
        aria-label="Conceptual diagram: known records are a small part of all incidents; the rest is underreported or unknown. Not to scale."
      >
        {LAYERS.map((l, i) => (
          <div key={l.key}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">{l.label}</span>
              <span className="font-mono text-[10px] text-slate-500">{i === 0 ? 'measured in dataset' : 'not quantified'}</span>
            </div>
            <div className="relative h-4 overflow-hidden rounded-md bg-white/[0.03]">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-md ${l.bar}`}
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.25 * i, ease: [0.16, 1, 0.3, 1] }}
                style={{ maxWidth: i === 0 ? '34%' : i === 1 ? '62%' : '100%' }}
              />
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-slate-400">{l.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-3.5 text-[12px] leading-relaxed text-slate-300">
        Available records represent only incidents that were documented, reported or independently verified.
        <span className="mt-1 block text-[11px] text-slate-500">
          Bar lengths are conceptual and do not represent an estimate of the unknown.
        </span>
      </div>
    </Panel>
  )
}
