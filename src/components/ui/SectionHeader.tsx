import type { ReactNode } from 'react'

interface SectionHeaderProps {
  id: string
  eyebrow: string
  title: string
  description?: ReactNode
  labels?: ReactNode
}

/** Anchor heading for each major dashboard section (targets of the sidebar). */
export function SectionHeader({ id, eyebrow, title, description, labels }: SectionHeaderProps) {
  return (
    <div id={id} className="scroll-mt-24 pt-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.18em] text-blue-400/90">{eyebrow}</p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">{title}</h2>
          {description && <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-400">{description}</p>}
        </div>
        {labels && <div className="flex flex-wrap gap-1.5">{labels}</div>}
      </div>
    </div>
  )
}
