import { ExternalLink } from 'lucide-react'
import type { DataRow } from '../types'

/**
 * The "Fonte" column with its document link. Derived estimates say so explicitly,
 * so they are never read as a figure published by the cited institution.
 */
export function SourceLink({ row, className = '' }: { row: DataRow; className?: string }) {
  const derived = /derivada/i.test(row.fonte)
  const label = derived ? `${row.fonte} (cálculo não oficial)` : `Fonte citada: ${row.fonte}`
  if (!row.url) return <span className={`text-ink-3 ${className}`}>{label} · sem link na planilha</span>
  return (
    <a
      href={row.url}
      target="_blank"
      rel="noreferrer"
      className={`text-ink-3 underline decoration-line underline-offset-2 transition-colors hover:text-ink hover:decoration-ink-3 ${className}`}
      title={derived ? `Documento usado como base da proporção: ${row.url}` : row.url}
    >
      {label}
      <ExternalLink className="ml-1 inline h-3 w-3 align-[-2px]" aria-hidden />
    </a>
  )
}
