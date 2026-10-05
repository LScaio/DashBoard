import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useDashboard } from '../../state/dashboardStore'
import { cn } from '../../utils/format'
import { NAV } from './navigation'

function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', compact && 'justify-center')}>
      <div
        className="flex h-8 w-8 shrink-0 items-end justify-center gap-[3px] rounded-lg border border-line-2 bg-panel-2 pb-1.5"
        aria-hidden
      >
        <span className="h-2 w-1 rounded-sm bg-primary" />
        <span className="h-3.5 w-1 rounded-sm bg-primary-2" />
        <span className="h-4.5 w-1 rounded-sm bg-primary" />
      </div>
      {!compact && (
        <div className="leading-none">
          <p className="text-[13px] font-bold tracking-[0.14em] text-white">CIÊNCIA</p>
          <p className="text-[13px] font-bold tracking-[0.14em] text-white">DELAS</p>
          <p className="mt-1 font-mono text-[9px] tracking-[0.3em] text-primary-2">DATA LAB</p>
        </div>
      )}
    </div>
  )
}

function NavItems({ compact, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const { page, setPage } = useDashboard()
  return (
    <nav aria-label="Dashboard pages" className="space-y-0.5">
      {NAV.map(({ id, label, Icon }) => {
        const active = page === id
        return (
          <button
            key={id}
            type="button"
            title={compact ? label : undefined}
            aria-current={active ? 'page' : undefined}
            onClick={() => {
              setPage(id)
              onNavigate?.()
              window.scrollTo({ top: 0 })
            }}
            className={cn(
              'relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
              compact && 'justify-center px-0',
              active ? 'bg-primary/15 text-white' : 'text-ink-3 hover:bg-white/[0.03] hover:text-ink',
            )}
          >
            {active && <span className="absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r bg-primary" aria-hidden />}
            <Icon className={cn('h-4 w-4 shrink-0', active && 'text-primary')} aria-hidden />
            {!compact && label}
          </button>
        )
      })}
    </nav>
  )
}

function DatasetStatus({ compact }: { compact?: boolean }) {
  if (compact)
    return (
      <div className="flex justify-center" title="Demo prototype — demonstration dataset">
        <span className="h-2 w-2 rounded-full bg-warn" />
      </div>
    )
  return (
    <div className="rounded-lg border border-line bg-panel-2 p-3">
      <p className="font-mono text-[9.5px] font-medium tracking-[0.16em] text-ink-3">DEMO PROTOTYPE</p>
      <p className="mt-1.5 flex items-center gap-2 text-xs text-ink-2">
        <span className="h-1.5 w-1.5 rounded-full bg-warn" aria-hidden />
        Dataset demonstrativo
      </p>
    </div>
  )
}

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  return (
    <>
      {/* Tablet: icon rail · Desktop: full sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-16 flex-col border-r border-line bg-[#0b0f17] md:flex lg:w-56">
        <div className="flex h-16 items-center border-b border-line px-3 lg:px-5">
          <div className="lg:hidden">
            <Brand compact />
          </div>
          <div className="hidden lg:block">
            <Brand />
          </div>
        </div>
        <div className="scroll-thin flex-1 overflow-y-auto px-3 py-4">
          <div className="lg:hidden">
            <NavItems compact />
          </div>
          <div className="hidden lg:block">
            <NavItems />
          </div>
        </div>
        <div className="border-t border-line p-3">
          <div className="lg:hidden">
            <DatasetStatus compact />
          </div>
          <div className="hidden lg:block">
            <DatasetStatus />
          </div>
        </div>
      </aside>

      {/* Mobile: slide-over menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 36 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-[#0b0f17] md:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-line px-5">
                <Brand />
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="rounded-md p-1.5 text-ink-3 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-4">
                <NavItems onNavigate={onCloseMobile} />
              </div>
              <div className="border-t border-line p-3">
                <DatasetStatus />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
