import { Reveal } from '../ui/Reveal'

const LIMITS = [
  'Nem toda violência é registrada.',
  'Nem toda vítima consegue denunciar.',
  'Nem todo registro possui o mesmo nível de evidência.',
  'Dados documentados não representam necessariamente a totalidade dos casos.',
]

export function Limits() {
  return (
    <section className="relative bg-night-900" aria-labelledby="limites-titulo">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-24 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-lilac-300">Responsabilidade científica</p>
          <h2 id="limites-titulo" className="mt-4 font-display text-4xl font-light leading-tight text-white sm:text-5xl">
            O que os dados não conseguem mostrar?
          </h2>
        </Reveal>
        <ol className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {LIMITS.map((l, i) => (
            <Reveal key={l} delay={i * 0.1}>
              <li className="flex items-baseline gap-6 py-6">
                <span className="font-display text-sm text-lilac-300/60">0{i + 1}</span>
                <span className="font-display text-xl font-light text-lilac-100 sm:text-2xl">{l}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
