import { motion } from 'framer-motion'
import { CircleCheck, Info, TriangleAlert } from 'lucide-react'
import { useMemo } from 'react'
import { consistencyChecks } from '../data/dataset'
import type { DataRow, DataStatus as Status } from '../types'
import { Card } from './Card'

const SEGMENTS: { status: Status; label: string; className: string }[] = [
  { status: 'Documentado', label: 'Documentados', className: 'bg-lilac' },
  { status: 'Estimativa', label: 'Estimativas não verificadas', className: 'fill-estimate' },
  { status: 'Não disponível', label: 'Não disponíveis', className: 'bg-ink-3/60' },
]

/**
 * Replaces the regional map: the spreadsheet has no geographic breakdown.
 * Shows how many indicators are documented vs estimated, and the automatic consistency checks.
 */
export function DataStatus({ rows, className }: { rows: DataRow[]; className?: string }) {
  const counts = SEGMENTS.map((s) => ({ ...s, count: rows.filter((r) => r.status === s.status).length }))
  const checks = useMemo(() => consistencyChecks(rows), [rows])
  const total = rows.length

  return (
    <Card title="Qualidade dos dados" className={className} delay={0.25}>
      <div className="flex h-full flex-col gap-3">
        <div>
          <p className="text-xs text-ink-2">
            <span className="tabular font-semibold text-ink">{total}</span> indicadores na planilha
          </p>
          <div
            className="mt-1.5 flex h-2.5 gap-[2px] overflow-hidden rounded-full"
            role="img"
            aria-label={counts.map((c) => `${c.count} ${c.label}`).join(', ')}
          >
            {counts
              .filter((c) => c.count)
              .map((c, i) => (
                <motion.span
                  key={c.status}
                  className={`h-full first:rounded-l-full last:rounded-r-full ${c.className}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(c.count / total) * 100}%` }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                />
              ))}
          </div>
          <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-ink-2">
            {counts.map((c) => (
              <li key={c.status} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-sm ${c.className}`} aria-hidden />
                <span className="tabular font-semibold text-ink">{c.count}</span> {c.label.toLowerCase()}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-medium text-ink-2">Checagens automáticas de consistência</p>
          <ul className="mt-1 space-y-1">
            {checks.map((c) => (
              <li key={c.label} className="flex gap-1.5 text-[11px] leading-snug" title={`Linhas da planilha: ${c.lines.join(', ')}`}>
                {c.ok ? (
                  <CircleCheck className="mt-px h-3.5 w-3.5 shrink-0 text-lilac" aria-label="Confere" />
                ) : (
                  <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0 text-alert" aria-label="Não confere" />
                )}
                <span>
                  <span className="text-ink">{c.label}</span>
                  <span className="tabular block text-ink-3">{c.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-auto flex gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11px] leading-snug text-ink-3">
          <Info className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />A planilha não traz dados por região, por isso o mapa foi retirado. A
          verificação dos valores ainda não foi concluída.
        </p>
      </div>
    </Card>
  )
}
