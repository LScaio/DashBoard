import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { useDashboard } from '../../context/dashboardStore'

const ICON = { success: CheckCircle2, info: Info, warning: TriangleAlert }
const COLOR = { success: 'text-emerald-400', info: 'text-blue-400', warning: 'text-amber-400' }

export function Toaster() {
  const { toasts, dismissToast } = useDashboard()
  return (
    <div
      className="no-print pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = ICON[t.tone]
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-white/10 bg-ink-800/95 p-3.5 shadow-2xl shadow-black/50 backdrop-blur"
              role="status"
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${COLOR[t.tone]}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-100">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{t.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                className="rounded p-0.5 text-slate-500 hover:text-slate-200"
                aria-label="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
