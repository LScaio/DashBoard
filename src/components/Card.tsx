import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps {
  title: string
  aside?: ReactNode
  className?: string
  children: ReactNode
  delay?: number
}

export function Card({ title, aside, className = '', children, delay = 0 }: CardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className={`flex min-h-0 min-w-0 flex-col rounded-2xl border border-line bg-card p-4 ${className}`}
    >
      <header className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2">{title}</h2>
        {aside}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </motion.section>
  )
}
