import { motion } from 'framer-motion'
import { LogoMark } from './Logo'

/** Brief intro shown on first load (presentation mode). */
export function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-950"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
      role="status"
      aria-label="Loading dashboard"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_60%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-blue-600/15 blur-3xl" aria-hidden />
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <LogoMark size={72} animated />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative mt-6 text-center text-sm font-semibold tracking-[0.28em] text-slate-100"
      >
        UKRAINE <span className="text-slate-500">—</span> WOMEN &amp; CONFLICT
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="relative mt-2 text-xs text-slate-400"
      >
        Humanitarian Intelligence Dashboard
      </motion.p>
      <div className="relative mt-8 h-[2px] w-48 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-300"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300/80"
      >
        Loading demonstration dataset
      </motion.p>
    </motion.div>
  )
}
