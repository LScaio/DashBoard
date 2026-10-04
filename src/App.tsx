import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { FilterPanel } from './components/filters/FilterPanel'
import { DashboardHeader } from './components/layout/DashboardHeader'
import { NAV_IDS } from './components/layout/navigation'
import { Sidebar } from './components/layout/Sidebar'
import { SplashScreen } from './components/layout/SplashScreen'
import { IncidentDrawer } from './components/tables/IncidentDrawer'
import { Toaster } from './components/ui/Toaster'
import { DashboardProvider } from './context/DashboardContext'
import { useActiveSection } from './hooks/useActiveSection'
import { useMediaQuery } from './hooks/useMediaQuery'
import { DashboardPage } from './pages/DashboardPage'

const SPLASH_MS = 1900

function Shell() {
  const [booting, setBooting] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1279px)')
  const [collapsedPref, setCollapsedPref] = useState<boolean | null>(null)
  const collapsed = collapsedPref ?? isTablet
  const active = useActiveSection(NAV_IDS, !booting)

  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), SPLASH_MS)
    return () => window.clearTimeout(t)
  }, [])

  const closeFilters = useCallback(() => setFiltersOpen(false), [])

  return (
    <>
      <AnimatePresence>{booting && <SplashScreen key="splash" />}</AnimatePresence>

      {!booting && (
        <div className="relative min-h-screen">
          <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
            <div className="absolute inset-0 bg-grid opacity-40" />
            <div className="absolute -top-40 left-1/3 h-[480px] w-[720px] rounded-full bg-blue-700/10 blur-[120px]" />
          </div>

          <Sidebar
            active={active}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsedPref(!collapsed)}
            mobileOpen={mobileNavOpen}
            onCloseMobile={() => setMobileNavOpen(false)}
          />

          <motion.div
            className={collapsed ? 'relative md:pl-[76px]' : 'relative md:pl-[272px]'}
            style={{ transition: 'padding 300ms cubic-bezier(.16,1,.3,1)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardHeader onOpenFilters={() => setFiltersOpen(true)} onOpenMenu={() => setMobileNavOpen(true)} />
            <main id="main">
              <DashboardPage />
            </main>
          </motion.div>

          <FilterPanel open={filtersOpen} onClose={closeFilters} />
          <IncidentDrawer />
          <Toaster />
        </div>
      )}
    </>
  )
}

export default function App() {
  return (
    <DashboardProvider>
      <Shell />
    </DashboardProvider>
  )
}
