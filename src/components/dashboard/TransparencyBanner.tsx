import { motion } from 'framer-motion'
import { FlaskConical } from 'lucide-react'
import { DataLabel } from '../ui/DataLabel'

export function TransparencyBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-3 rounded-xl border border-amber-400/20 bg-gradient-to-r from-amber-400/[0.07] to-transparent px-4 py-3 xl:flex-row xl:items-center"
      role="note"
    >
      <div className="flex min-w-0 items-start gap-3 xl:flex-1 xl:items-center">
        <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-amber-300 xl:mt-0" aria-hidden />
        <p className="text-[12.5px] leading-relaxed text-slate-300">
          <strong className="font-semibold text-amber-200">Prototype.</strong> Every figure on this page is generated from a synthetic
          demonstration dataset to show how the platform would work. It does not describe real events or people.
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-1.5 pl-7 xl:pl-0">
        <DataLabel kind="demo" />
        <DataLabel kind="not-official" />
        <DataLabel kind="documented" />
        <DataLabel kind="limitations" />
      </div>
    </motion.div>
  )
}
