import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const STEPS = [
  { key: 'title', ms: 2400 },
  { key: 'question', ms: 3000 },
  { key: 'women', ms: 2200 },
] as const

/** Abertura em três tempos: título, pergunta e "Mulheres." */
export function Intro({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step >= STEPS.length) {
      onDone()
      return
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), STEPS[step].ms)
    return () => window.clearTimeout(t)
  }, [step, onDone])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => (e.key === 'Escape' || e.key === 'Enter') && onDone()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDone])

  const current = STEPS[step]?.key

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-night-950 px-6"
      exit={{ opacity: 0, transition: { duration: 1.1, ease: 'easeInOut' } }}
      role="dialog"
      aria-label="Abertura — Ciência Delas"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.14),transparent_60%)]"
        aria-hidden
      />
      <AnimatePresence mode="wait">
        {current === 'title' && (
          <motion.h1
            key="title"
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.32em' }}
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative text-center font-display text-3xl font-light text-white sm:text-5xl"
          >
            CIÊNCIA DELAS
          </motion.h1>
        )}
        {current === 'question' && (
          <motion.p
            key="question"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-2xl text-center font-display text-2xl font-light italic leading-snug text-lilac-100/90 sm:text-4xl"
          >
            Quando os números falam, quem estamos ouvindo?
          </motion.p>
        )}
        {current === 'women' && (
          <motion.p
            key="women"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-gradient-to-r from-lilac-200 via-lilac-300 to-sky-soft bg-clip-text font-display text-5xl font-normal text-transparent sm:text-7xl"
          >
            Mulheres.
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={onDone}
        className="absolute bottom-8 right-8 rounded-full border border-white/10 px-4 py-2 text-xs tracking-[0.18em] text-lilac-100/60 uppercase transition-colors hover:border-lilac-300/40 hover:text-white"
      >
        Pular abertura
      </button>
      <p className="absolute bottom-8 left-8 hidden text-[10.5px] uppercase tracking-[0.2em] text-lilac-100/35 sm:block">
        Protótipo • Dados demonstrativos
      </p>
    </motion.div>
  )
}
