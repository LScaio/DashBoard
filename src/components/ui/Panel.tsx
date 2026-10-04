import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '../../utils/format'

interface PanelProps {
  title?: ReactNode
  subtitle?: ReactNode
  icon?: ReactNode
  actions?: ReactNode
  labels?: ReactNode
  className?: string
  bodyClassName?: string
  children: ReactNode
  tone?: 'default' | 'subdued'
}

/** Glass card used for every dashboard module. */
export function Panel({ title, subtitle, icon, actions, labels, className, bodyClassName, children, tone = 'default' }: PanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative rounded-2xl border border-white/[0.07] shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_20px_40px_-24px_rgba(0,0,0,0.6)]',
        tone === 'default' ? 'glass' : 'bg-ink-900/60',
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex flex-col gap-3 border-b border-white/[0.06] px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-blue-300">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold tracking-tight text-slate-100">{title}</h3>
              {subtitle && <p className="mt-0.5 text-[13px] leading-snug text-slate-400">{subtitle}</p>}
              {labels && <div className="mt-2 flex flex-wrap gap-1.5">{labels}</div>}
            </div>
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </motion.section>
  )
}
