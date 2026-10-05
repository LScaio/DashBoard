import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '../../utils/format'

interface CardProps {
  title?: string
  subtitle?: ReactNode
  actions?: ReactNode
  className?: string
  bodyClassName?: string
  children: ReactNode
  delay?: number
}

/** Standard dashboard panel. */
export function Card({ title, subtitle, actions, className, bodyClassName, children, delay = 0 }: CardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={cn('flex min-w-0 flex-col rounded-xl border border-line bg-panel shadow-[0_1px_2px_rgba(0,0,0,0.4)]', className)}
    >
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-4 pt-4">
          <div className="min-w-0">
            {title && <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-2">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-ink-3">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn('min-w-0 flex-1 p-4', bodyClassName)}>{children}</div>
    </motion.section>
  )
}
