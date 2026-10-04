import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { FilterBar } from './components/layout/FilterBar'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { NAV } from './components/layout/navigation'
import { Sidebar } from './components/layout/Sidebar'
import { IncidentDrawer } from './components/widgets/IncidentDrawer'
import { PAGES } from './pages/registry'
import { DashboardProvider } from './state/DashboardProvider'
import { useDashboard } from './state/dashboardStore'

function Shell() {
  const { page } = useDashboard()
  const [filtersOpen, setFiltersOpen] = useState(() => window.matchMedia('(min-width: 768px)').matches)
  const [menuOpen, setMenuOpen] = useState(false)
  const Page = PAGES[page]
  const label = NAV.find((n) => n.id === page)?.label

  return (
    <div className="min-h-screen">
      <Sidebar mobileOpen={menuOpen} onCloseMobile={() => setMenuOpen(false)} />
      <div className="md:pl-16 lg:pl-56">
        <Header filtersOpen={filtersOpen} onToggleFilters={() => setFiltersOpen((o) => !o)} onOpenMenu={() => setMenuOpen(true)} />
        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <FilterBar />
            </motion.div>
          )}
        </AnimatePresence>
        <main className="space-y-4 p-4 lg:p-6">
          {page !== 'overview' && <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">{label}</p>}
          <Page key={page} />
        </main>
        <Footer />
      </div>
      <IncidentDrawer />
    </div>
  )
}

export default function App() {
  return (
    <DashboardProvider>
      <Shell />
    </DashboardProvider>
  )
}
