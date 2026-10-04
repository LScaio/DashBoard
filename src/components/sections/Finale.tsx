import { motion } from 'framer-motion'

const LINES = ['Dados revelam padrões.', 'Ciência revela possibilidades.', 'Mas são as pessoas que dão sentido aos números.']
const CLOSING = ['Mulheres fazendo ciência.', 'Mulheres produzindo conhecimento.', 'Mulheres transformando o mundo.']

const appear = (delay: number) => ({
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-120px' },
  transition: { duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] as const },
})

export function Finale() {
  return (
    <section className="grain relative overflow-hidden bg-night-950" aria-label="Encerramento">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-5 py-32 sm:px-8">
        <div className="space-y-6">
          {LINES.map((line, i) => (
            <motion.p
              key={line}
              {...appear(i * 1.3)}
              className={`font-display font-light leading-tight ${i === 2 ? 'text-3xl text-white sm:text-5xl lg:text-6xl' : 'text-3xl text-lilac-100/60 sm:text-5xl'}`}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div {...appear(4.2)} className="mt-28 border-t border-white/10 pt-12">
          <p className="font-display text-4xl font-light tracking-[0.2em] text-white sm:text-6xl">CIÊNCIA DELAS</p>
          <ul className="mt-6 space-y-1">
            {CLOSING.map((c) => (
              <li key={c} className="font-display text-xl font-light italic text-lilac-200 sm:text-2xl">
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-12 text-[10.5px] uppercase tracking-[0.22em] text-lilac-100/35">Protótipo conceitual</p>
        </motion.div>
      </div>
    </section>
  )
}
