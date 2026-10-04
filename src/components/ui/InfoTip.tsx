import { AnimatePresence, motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { cn } from '../../utils/format'

interface InfoTipProps {
  content: ReactNode
  label?: string
  className?: string
  side?: 'top' | 'bottom'
}

/** Small accessible tooltip triggered by hover or keyboard focus. */
export function InfoTip({ content, label = 'More information', className, side = 'top' }: InfoTipProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <span className={cn('relative inline-flex', className)} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="rounded text-slate-500 transition-colors hover:text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
      >
        <Info className="h-3.5 w-3.5" aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: side === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute left-1/2 z-50 w-64 -translate-x-1/2 rounded-lg border border-white/10 bg-ink-800/95 p-3 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-slate-300 shadow-xl shadow-black/40 backdrop-blur',
              side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
            )}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
