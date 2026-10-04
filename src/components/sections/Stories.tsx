import { motion } from 'framer-motion'
import { Luggage, Microscope, Sprout } from 'lucide-react'
import { Reveal } from '../ui/Reveal'

const STORIES = [
  {
    n: '01',
    title: 'Uma mulher deslocada.',
    text: 'Ela deixou a cidade onde nasceu com uma mochila e duas crianças. No registro, vira uma linha: “deslocamento forçado”. Na vida, é recomeçar tudo — idioma, trabalho, escola, rede de apoio.',
    Icon: Luggage,
    glow: 'from-iris/30',
  },
  {
    n: '02',
    title: 'Uma pesquisadora documentando evidências.',
    text: 'Ela cruza depoimentos, relatórios e imagens para que nada se perca. Cada dado verificado é resultado de método, cuidado e ética — e muitas vezes, do trabalho de mulheres cientistas.',
    Icon: Microscope,
    glow: 'from-violet/30',
  },
  {
    n: '03',
    title: 'Uma comunidade tentando reconstruir sua vida.',
    text: 'Escolas improvisadas, redes de apoio, atendimento psicológico. Por trás das médias e das tendências, há pessoas reorganizando o cotidiano, dia após dia.',
    Icon: Sprout,
    glow: 'from-sky-soft/25',
  },
]

export function Stories() {
  return (
    <section id="historias" className="relative overflow-hidden bg-night-950">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-36">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-lilac-300">05 · Histórias</p>
          <h2 className="mt-5 font-display text-[44px] font-light leading-none tracking-tight text-white sm:text-7xl">
            Por trás do número
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-lilac-100/65">
            Cada registro em uma tabela começou como uma vida. Estas são narrativas conceituais — não representam pessoas reais.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {STORIES.map(({ n, title, text, Icon, glow }, i) => (
            <Reveal key={n} delay={i * 0.15}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-night-800 to-night-900 p-8 sm:p-10"
              >
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br ${glow} to-transparent opacity-70 blur-2xl transition-opacity duration-700 group-hover:opacity-100`}
                  aria-hidden
                />
                <div className="relative flex items-start justify-between">
                  <span className="font-display text-7xl font-light leading-none text-lilac-300/40">{n}</span>
                  <Icon className="h-6 w-6 text-lilac-200/70" strokeWidth={1.4} aria-hidden />
                </div>
                <h3 className="relative mt-auto pt-16 font-display text-[28px] font-light leading-tight text-white sm:text-[32px]">
                  “{title}”
                </h3>
                <p className="relative mt-4 text-[15px] leading-relaxed text-lilac-100/60">{text}</p>
                <p className="relative mt-6 text-[10px] uppercase tracking-[0.18em] text-lilac-300/60">Narrativa conceitual</p>
              </motion.article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mx-auto mt-24 max-w-4xl text-center">
          <p className="font-display text-3xl font-light leading-snug text-white sm:text-[44px]">
            Dados ajudam a identificar <span className="italic text-lilac-300">padrões</span>.
            <br />
            Histórias ajudam a compreender <span className="italic text-lilac-300">pessoas</span>.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
