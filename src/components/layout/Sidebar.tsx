import { AnimatePresence, motion } from 'framer-motion'
import { ChevronsLeft, ChevronsRight, X } from 'lucide-react'
import { DATASET_META, DATASET_RANGE } from '../../data/incidents'
import { formatDate } from '../../utils/date'
import { cn } from '../../utils/format'
import { LogoMark, Wordmark } from './Logo'
import { NAV_ITEMS } from './navigation'

interface SidebarProps {
  active: string
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

function NavList({ active, collapsed, onNavigate }: { active: string; collapsed: boolean; onNavigate?: () => void }) {
  return (
    <nav aria-label="Dashboard sections" className="flex flex-col gap-0.5">
      {!collapsed && <p className="mb-2 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">Analysis</p>}
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <a
            key={id}
            href={`#${id}`}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            aria-current={isActive ? 'location' : undefined}
            className={cn(
              'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400',
              collapsed && 'justify-center px-0',
              isActive ? 'text-white' : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="nav-active"
                className="absolute inset-0 rounded-lg border border-blue-400/20 bg-gradient-to-r from-blue-500/20 to-blue-500/[0.04]"
                transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              />
            )}
            {isActive && <span className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-blue-400" aria-hidden />}
            <Icon
              className={cn('relative h-4 w-4 shrink-0', isActive ? 'text-blue-300' : 'text-slate-500 group-hover:text-slate-300')}
              aria-hidden
            />
            {!collapsed && <span className="relative truncate">{label}</span>}
          </a>
        )
      })}
    </nav>
  )
}

function DataStatus({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <div className="flex justify-center" title={`Data status: ${DATASET_META.name}`}>
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-40" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
        </span>
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-3.5">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">Data status</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
        </span>
        <span className="text-[13px] font-medium text-amber-200">{DATASET_META.name}</span>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
        Synthetic records · {formatDate(DATASET_RANGE.first)} – {formatDate(DATASET_RANGE.last)}
      </p>
      <p className="mt-1 font-mono text-[10px] text-slate-500">{DATASET_META.version} · not official statistics</p>
    </div>
  )
}

export function Sidebar({ active, collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Desktop / tablet — fixed, collapsible */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 272 }}
        transition={{ type: 'spring', stiffness: 300, damping: 34 }}
        className="no-print fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-white/[0.06] bg-ink-900/80 backdrop-blur-xl md:flex"
        aria-label="Sidebar"
      >
        <div className={cn('flex h-[72px] items-center gap-3 border-b border-white/[0.06] px-5', collapsed && 'justify-center px-0')}>
          <LogoMark />
          {!collapsed && <Wordmark />}
        </div>
        <div className="scrollbar-thin flex-1 overflow-y-auto px-3 py-5">
          <NavList active={active} collapsed={collapsed} />
        </div>
        <div className="space-y-3 border-t border-white/[0.06] p-3">
          <DataStatus collapsed={collapsed} />
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs text-slate-500 transition-colors hover:bg-white/[0.03] hover:text-slate-300"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronsLeft className="h-4 w-4" /> Collapse
              </>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Mobile — slide-over menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              aria-hidden
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-[300px] flex-col border-r border-white/[0.08] bg-ink-900 md:hidden"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <LogoMark size={32} />
                  <Wordmark />
                </div>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="rounded-lg p-2 text-slate-400 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-5">
                <NavList active={active} collapsed={false} onNavigate={onCloseMobile} />
              </div>
              <div className="border-t border-white/[0.06] p-3">
                <DataStatus collapsed={false} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
