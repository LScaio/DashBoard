import { Reveal } from '../ui/Reveal'

const PARAGRAPHS = [
  {
    lead: 'A guerra não afeta todas as pessoas da mesma maneira.',
    text: 'Quando um conflito começa, ele reorganiza a vida de forma desigual. Gênero, idade, território e acesso a recursos mudam o que cada pessoa enfrenta — e como consegue se proteger.',
  },
  {
    lead: 'Mulheres podem enfrentar muitas formas de violência.',
    text: 'Além da agressão física, há violência sexual, deslocamento forçado, insegurança, perda de renda e de redes de apoio. Muitas dessas experiências acontecem longe dos olhos — e longe dos registros.',
  },
  {
    lead: 'A ciência pode ajudar a enxergar o que fica invisível.',
    text: 'Pesquisa, análise de dados e visualização ajudam a identificar padrões, compreender impactos e dar visibilidade a fenômenos que muitas vezes permanecem subnotificados.',
  },
]

export function Context() {
  return (
    <section id="contexto" className="relative bg-paper text-paper-ink">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-violet">01 · Contexto</p>
            <h2 className="mt-5 font-display text-[38px] font-light leading-[1.05] tracking-tight sm:text-6xl">
              O que acontece quando a guerra muda a vida das mulheres?
            </h2>
            <p className="mt-10 font-display text-2xl font-light italic leading-snug text-violet sm:text-[28px]">
              “Por trás de cada dado existe uma história. Por trás de cada história, uma mulher.”
            </p>
          </Reveal>

          <div className="space-y-12 lg:pt-10">
            {PARAGRAPHS.map((p, i) => (
              <Reveal key={p.lead} delay={i * 0.12}>
                <div className="flex gap-6">
                  <span className="mt-1 font-display text-sm text-violet/70">0{i + 1}</span>
                  <div>
                    <h3 className="text-xl font-medium leading-snug sm:text-2xl">{p.lead}</h3>
                    <p className="mt-3 text-base leading-relaxed text-paper-ink/70 sm:text-[17px]">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.4}>
              <p className="border-t border-paper-ink/10 pt-8 text-sm leading-relaxed text-paper-ink/60">
                O objetivo não é transformar o sofrimento em estatística. É usar a ciência para{' '}
                <strong className="font-medium text-paper-ink">visualizar, investigar, compreender, documentar</strong> e{' '}
                <strong className="font-medium text-paper-ink">dar visibilidade</strong>.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
