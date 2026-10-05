import type { ReactNode } from 'react'
import { cn } from '../../utils/format'

import type { Tone } from './tones'

const TONE: Record<Tone, string> = {
  primary: 'border-primary/30 bg-primary/10 text-[#b3b8ff]',
  ok: 'border-ok/30 bg-ok/10 text-[#6ee79a]',
  warn: 'border-warn/30 bg-warn/10 text-[#f8c060]',
  alert: 'border-alert/30 bg-alert/10 text-[#f58b8b]',
  muted: 'border-line-2 bg-white/[0.03] text-ink-2',
}

export function Badge({ tone = 'muted', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-md border px-1.5 py-0.5 text-[11px] font-medium',
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
