import type { DataStatus } from '../types'

const STYLE: Record<DataStatus, { label: string; className: string }> = {
  Documentado: { label: 'Documentado', className: 'border-lilac/35 bg-lilac/10 text-lilac' },
  Estimativa: { label: 'Estimativa não verificada', className: 'border-dashed border-estimate/60 bg-estimate/10 text-estimate' },
  'Não disponível': { label: 'Não disponível', className: 'border-line text-ink-3' },
}

/** The "Status do dado" column as a chip. Estimates always read "não verificada". */
export function StatusBadge({ status, className = '' }: { status: DataStatus; className?: string }) {
  const s = STYLE[status]
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-md border px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider ${s.className} ${className}`}
    >
      {s.label}
    </span>
  )
}
