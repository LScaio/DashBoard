import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { HeroArt } from '../art/HeroArt'

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] as const },
})

export function Hero() {
  return (
    <section id="inicio" className="grain relative flex min-h-screen items-center overflow-hidden pt-16">
      <div
        className="pointer-events-none absolute -left-40 top-1/4 h-[520px] w-[520px] rounded-full bg-violet/20 blur-[140px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-iris/15 blur-[120px]"
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-6">
        <div>
          <motion.p {...fade(0.1)} className="text-[11px] font-medium uppercase tracking-[0.3em] text-lilac-300">
            Mulheres em zonas de conflito · Ucrânia
          </motion.p>
          <motion.h1
            {...fade(0.25)}
            className="mt-6 font-display text-[56px] font-light leading-[0.95] tracking-tight text-white sm:text-[84px] lg:text-[104px]"
          >
            Ciência
            <br />
            <span className="bg-gradient-to-r from-lilac-200 via-lilac-300 to-sky-soft bg-clip-text italic text-transparent">Delas</span>
          </motion.h1>
          <motion.p {...fade(0.45)} className="mt-7 max-w-xl text-lg leading-relaxed text-lilac-100/80 sm:text-xl">
            Mulheres, ciência e os dados que não podem ser ignorados.
          </motion.p>
          <motion.p {...fade(0.55)} className="mt-2 text-sm text-lilac-100/50">
            Dados que revelam histórias. Ciência que dá visibilidade.
          </motion.p>

          <motion.div {...fade(0.7)} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contexto"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-night-900 shadow-[0_10px_40px_-10px_rgba(196,181,253,0.6)] transition-transform hover:-translate-y-0.5"
            >
              Explorar o projeto
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
            </a>
            <span className="text-xs uppercase tracking-[0.18em] text-lilac-100/40">Protótipo conceitual</span>
          </motion.div>

          <motion.blockquote
            {...fade(0.9)}
            className="mt-16 max-w-lg border-l border-lilac-300/40 pl-5 font-display text-lg font-light italic leading-relaxed text-lilac-100/75 sm:text-xl"
          >
            “A ciência também existe para revelar aquilo que muitas vezes permanece invisível.”
          </motion.blockquote>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto aspect-square w-full max-w-[520px]"
        >
          <HeroArt />
        </motion.div>
      </div>

      <motion.a
        href="#contexto"
        aria-label="Rolar para o contexto"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-lilac-100/40 sm:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        <ArrowDown className="h-5 w-5" />
      </motion.a>
    </section>
  )
}
