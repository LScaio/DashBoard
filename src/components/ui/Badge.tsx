import type { ReactNode } from 'react'
import { cn } from '../../utils/format'

export type Tone = 'neutral' | 'accent' | 'alert' | 'warn' | 'ok' | 'muted'

const TONE_CLASS: Record<Tone, string> = {
  neutral: 'border-slate-500/25 bg-slate-500/10 text-slate-300',
  accent: 'border-blue-400/30 bg-blue-500/10 text-blue-300',
  alert: 'border-red-400/30 bg-red-500/10 text-red-300',
  warn: 'border-amber-400/30 bg-amber-500/10 text-amber-300',
  ok: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
  muted: 'border-white/5 bg-white/[0.03] text-slate-400',
}

const DOT_CLASS: Record<Tone, string> = {
  neutral: 'bg-slate-400',
  accent: 'bg-blue-400',
  alert: 'bg-red-400',
  warn: 'bg-amber-400',
  ok: 'bg-emerald-400',
  muted: 'bg-slate-500',
}

interface BadgeProps {
  tone?: Tone
  dot?: boolean
  icon?: ReactNode
  className?: string
  children: ReactNode
  title?: string
}

export function Badge({ tone = 'neutral', dot, icon, className, children, title }: BadgeProps) {
  return (
    <span
      title={title}
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-[11px] font-medium leading-4',
        TONE_CLASS[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', DOT_CLASS[tone])} aria-hidden />}
      {icon}
      {children}
    </span>
  )
}
