import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useActiveSection } from '../../hooks/useActiveSection'
import { NAV_IDS, NAV_ITEMS } from './navigation'

export function TopNav() {
  const active = useActiveSection(NAV_IDS)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled || open ? 'border-b border-white/[0.06] bg-night-900/80 backdrop-blur-xl' : 'bg-transparent'}`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 sm:px-8" aria-label="Navegação principal">
        <a href="#inicio" className="font-display text-[15px] font-medium tracking-[0.22em] text-white" onClick={() => setOpen(false)}>
          CIÊNCIA DELAS
        </a>

        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-[13px] transition-colors ${isActive ? 'text-white' : 'text-lilac-100/60 hover:text-white'}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>

        <span className="ml-auto hidden rounded-full border border-lilac-300/20 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-lilac-200/80 sm:inline-flex lg:ml-2">
          Protótipo • Dados demonstrativos
        </span>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="ml-auto rounded-full p-2 text-lilac-100/80 hover:text-white sm:ml-0 lg:hidden"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-5 lg:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <li key={item.id} className="border-t border-white/[0.05]">
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className={`block py-3.5 font-display text-lg ${active === item.id ? 'text-white' : 'text-lilac-100/70'}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="border-t border-white/[0.05] py-4 text-[10.5px] uppercase tracking-[0.18em] text-lilac-200/60">
              Protótipo • Dados demonstrativos
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
