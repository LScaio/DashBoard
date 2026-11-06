import { ExternalLink } from 'lucide-react'
import type { Freshness } from '../data/derive'
import { SOURCES_PAGE } from '../config'

const BADGE: Record<Freshness, { label: string; title: string; className: string }> = {
  live: {
    label: 'API ao vivo',
    title: 'Número consultado agora na API pública da fonte',
    className: 'bg-recent-soft text-recent ring-recent/30',
  },
  recent: {
    label: 'Atualização recente',
    title: 'Fonte publicada nos últimos 60 dias',
    className: 'bg-recent-soft text-recent ring-recent/30',
  },
  historical: {
    label: 'Dado histórico',
    title: 'Último dado verificado disponível; a fonte não publicou atualização mais recente',
    className: 'bg-card-2 text-ink-2 ring-line',
  },
}

export function FreshnessBadge({ kind, justUpdated = false }: { kind: Freshness; justUpdated?: boolean }) {
  const b = justUpdated
    ? { label: 'Atualizado agora', title: 'Novos dados chegaram enquanto a página estava aberta', className: BADGE.recent.className }
    : BADGE[kind]
  return (
    <span
      title={b.title}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide ring-1 ${b.className}`}
    >
      {kind !== 'historical' || justUpdated ? <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-current" aria-hidden /> : null}
      {b.label}
    </span>
  )
}

interface SourceTagProps {
  /** Short source name, e.g. "ONU · ACNUDH (HRMMU)" */
  source: string
  /** What period / date the numbers cover */
  period: string
  /** Anchor on the sources page */
  anchor: string
  kind: Freshness
  justUpdated?: boolean
}

/** Footer line of every data card: who published it, for which period, and how fresh it is. */
export function SourceTag({ source, period, anchor, kind, justUpdated }: SourceTagProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-[11.5px] leading-snug text-ink-3">
      <p className="min-w-0">
        <span className="font-semibold text-ink-2">Fonte:</span> {source} · {period}
      </p>
      <div className="flex items-center gap-2">
        <FreshnessBadge kind={kind} justUpdated={justUpdated} />
        <a
          href={`${SOURCES_PAGE}#${anchor}`}
          className="inline-flex items-center gap-1 font-medium text-accent underline-offset-2 hover:underline"
          aria-label={`Metodologia e links da fonte: ${source}`}
        >
          Ver fonte <ExternalLink size={11} aria-hidden />
        </a>
      </div>
    </div>
  )
}
