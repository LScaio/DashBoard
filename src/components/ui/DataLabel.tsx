import { AlertTriangle, Database, FileWarning, Info } from 'lucide-react'
import { cn } from '../../utils/format'

/** Transparency labels that mark the nature and limits of displayed figures. */
export type DataLabelKind = 'demo' | 'not-official' | 'documented' | 'limitations' | 'illustrative' | 'generated' | 'not-integrated'

const CONFIG: Record<DataLabelKind, { text: string; cls: string; Icon: typeof Info; hint: string }> = {
  demo: {
    text: 'Demonstration data',
    cls: 'text-amber-300/90 border-amber-400/25 bg-amber-400/[0.06]',
    Icon: Database,
    hint: 'Synthetic records generated for this prototype.',
  },
  'not-official': {
    text: 'Not official statistics',
    cls: 'text-amber-300/90 border-amber-400/25 bg-amber-400/[0.06]',
    Icon: FileWarning,
    hint: 'These figures must not be cited as statistics.',
  },
  documented: {
    text: 'Documented cases only',
    cls: 'text-sky-300/90 border-sky-400/25 bg-sky-400/[0.06]',
    Icon: Info,
    hint: 'Only incidents that were documented or reported are counted.',
  },
  limitations: {
    text: 'Data limitations apply',
    cls: 'text-slate-300 border-slate-400/20 bg-slate-400/[0.05]',
    Icon: AlertTriangle,
    hint: 'See “How to read this dashboard”.',
  },
  illustrative: {
    text: 'Illustrative dataset — not official statistics',
    cls: 'text-amber-300/90 border-amber-400/25 bg-amber-400/[0.06]',
    Icon: FileWarning,
    hint: 'Synthetic data used to demonstrate the visualisation.',
  },
  'not-integrated': {
    text: 'Potential sources — not integrated',
    cls: 'text-slate-300 border-slate-400/20 bg-slate-400/[0.05]',
    Icon: Info,
    hint: 'No data from these organisations is used in this prototype.',
  },
  generated: {
    text: 'Generated from demonstration data',
    cls: 'text-amber-300/90 border-amber-400/25 bg-amber-400/[0.06]',
    Icon: Database,
    hint: 'Observations are computed automatically from synthetic records.',
  },
}

export function DataLabel({ kind, className }: { kind: DataLabelKind; className?: string }) {
  const { text, cls, Icon, hint } = CONFIG[kind]
  return (
    <span
      title={hint}
      className={cn(
        'inline-flex max-w-full items-center gap-1 rounded border px-1.5 py-[3px] font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.08em]',
        cls,
        className,
      )}
    >
      <Icon className="h-2.5 w-2.5 shrink-0" aria-hidden />
      {text}
    </span>
  )
}
