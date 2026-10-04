import { motion } from 'framer-motion'
import { Building2, Gavel, Globe2, HeartHandshake, Landmark } from 'lucide-react'
import type { PotentialSource } from '../../data/sources'

const ICON: Record<PotentialSource['category'], typeof Globe2> = {
  'United Nations': Globe2,
  'Regional organisation': Building2,
  Judicial: Gavel,
  National: Landmark,
  Humanitarian: HeartHandshake,
}

export function SourceCard({ source, index }: { source: PotentialSource; index: number }) {
  const Icon = ICON[source.category]
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.04 * index, duration: 0.45 }}
      whileHover={{ y: -2 }}
      className="flex flex-col rounded-xl border border-white/[0.07] bg-ink-900/60 p-4 transition-colors hover:border-white/[0.14]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-300">
          <Icon className="h-4 w-4" aria-hidden />
        </div>
        <span className="rounded border border-slate-400/20 bg-slate-400/[0.06] px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.08em] text-slate-400">
          Not integrated
        </span>
      </div>
      <h4 className="mt-3 text-[13.5px] font-semibold leading-snug text-slate-100">{source.name}</h4>
      <p className="mt-1 text-[12px] leading-relaxed text-slate-400">{source.description}</p>
      <div className="mt-auto flex items-center justify-between pt-3 text-[11px]">
        <span className="text-slate-500">{source.category}</span>
        <span className="text-slate-400">{source.dataKind}</span>
      </div>
    </motion.article>
  )
}
