import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps {
  id?: string
  title: string
  subtitle?: ReactNode
  aside?: ReactNode
  footer?: ReactNode
  className?: string
  children: ReactNode
  delay?: number
  /** Briefly highlights the card (new data arrived while the page was open). */
  flash?: boolean
}

export function Card({ id, title, subtitle, aside, footer, className = '', children, delay = 0, flash = false }: CardProps) {
  const headingId = id ? `${id}-title` : undefined
  return (
    <motion.section
      id={id}
      aria-labelledby={headingId}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className={`flex min-w-0 flex-col rounded-2xl border border-line bg-card p-4 shadow-sm shadow-black/[0.03] sm:p-5 ${flash ? 'flash-update' : ''} ${className}`}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h2 id={headingId} className="text-[15px] font-semibold leading-snug text-ink">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-[12.5px] leading-snug text-ink-3">{subtitle}</p>}
        </div>
        {aside}
      </header>
      <div className="min-w-0 flex-1">{children}</div>
      {footer && <footer className="mt-4 border-t border-line pt-3">{footer}</footer>}
    </motion.section>
  )
}
