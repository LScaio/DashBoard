import { ArrowLeft, ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'
import { CREDIT } from './brand'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { FreshnessBadge } from './components/SourceTag'
import { INVASION_START_ISO } from './config'
import { headline, pgoSnapshots } from './data/derive'
import type { DashboardData } from './data/types'
import { useDashboardData } from './data/useDashboardData'
import { useTheme } from './theme'
import { fmt, fmtDate } from './utils/format'

function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-baseline gap-1 break-all text-accent underline-offset-2 hover:underline"
    >
      {children}
      <ExternalLink size={11} className="shrink-0 self-center" aria-hidden />
    </a>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-0.5 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
      <dt className="text-[12px] font-semibold uppercase tracking-wide text-ink-3">{label}</dt>
      <dd className="text-[14px] leading-relaxed text-ink">{children}</dd>
    </div>
  )
}

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 rounded-2xl border border-line bg-card p-5 sm:p-6">
      <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-accent">{kicker}</p>
      <h2 className="mt-1 text-[19px] font-semibold leading-snug text-ink">{title}</h2>
      <dl className="mt-4 space-y-3">{children}</dl>
    </section>
  )
}

function Content({ data, live }: { data: DashboardData; live: boolean }) {
  const { casualties: cas, crsv, pgo, displacement: disp } = data
  const h = headline(data)
  const { latest, mapped } = pgoSnapshots(data)
  const pgoSorted = [...pgo.snapshots].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <>
      <section className="rounded-2xl border border-line bg-card p-5 sm:p-6" aria-labelledby="resumo">
        <h2 id="resumo" className="text-[17px] font-semibold text-ink">
          Resumo das fontes
        </h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="text-[11.5px] uppercase tracking-wide text-ink-3">
              <tr>
                <th className="py-2 pr-3 font-semibold">Dado na dashboard</th>
                <th className="py-2 pr-3 font-semibold">Instituição</th>
                <th className="py-2 pr-3 font-semibold">Período</th>
                <th className="py-2 pr-3 font-semibold">Publicado em</th>
                <th className="py-2 font-semibold">Atualização</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              <tr className="border-t border-line">
                <td className="py-2 pr-3">Mulheres e meninas mortas e feridas; linha do tempo “Física”</td>
                <td className="py-2 pr-3">ONU · ACNUDH / HRMMU</td>
                <td className="py-2 pr-3">
                  {fmtDate(cas.periodStart)} – {fmtDate(cas.periodEnd)}
                </td>
                <td className="py-2 pr-3">{fmtDate(cas.publishedAt)}</td>
                <td className="py-2">Automática (diária)</td>
              </tr>
              <tr className="border-t border-line">
                <td className="py-2 pr-3">Sobreviventes de violência sexual; contexto e vítimas</td>
                <td className="py-2 pr-3">ONU · ACNUDH / HRMMU</td>
                <td className="py-2 pr-3">
                  {fmtDate(crsv.periodStart)} – {fmtDate(crsv.periodEnd)}
                </td>
                <td className="py-2 pr-3">{fmtDate(crsv.publishedAt)}</td>
                <td className="py-2">Manual (relatório temático)</td>
              </tr>
              <tr className="border-t border-line">
                <td className="py-2 pr-3">Mapa; linha do tempo “Sexual”</td>
                <td className="py-2 pr-3">Procuradoria-Geral da Ucrânia</td>
                <td className="py-2 pr-3">
                  24/02/2022 – {fmtDate(latest.date)} (mapa: até {fmtDate(mapped.date)})
                </td>
                <td className="py-2 pr-3">{fmtDate(latest.date)}</td>
                <td className="py-2">Manual (comunicados)</td>
              </tr>
              <tr className="border-t border-line">
                <td className="py-2 pr-3">Mulheres e meninas deslocadas; linha do tempo “Deslocamento”</td>
                <td className="py-2 pr-3">ACNUR (UNHCR)</td>
                <td className="py-2 pr-3">2021 – 31/12/{disp.latest.year}</td>
                <td className="py-2 pr-3">anual</td>
                <td className="py-2">API pública, consultada pelo navegador</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <Section id="ohchr-civilian-casualties" kicker="Violência física · ataques contra civis" title="Vítimas civis verificadas pela ONU">
        <Field label="Instituição">{cas.institution}</Field>
        <Field label="Documento">
          <A href={cas.pageUrl}>{cas.document}</A>
          <br />
          <A href={cas.pdfUrl}>PDF original</A> · <A href={cas.listUrl}>todas as atualizações mensais</A>
        </Field>
        <Field label="Período dos dados">
          {fmtDate(cas.periodStart)} a {fmtDate(cas.periodEnd)} · publicado em {fmtDate(cas.publishedAt)} · conferido em{' '}
          {fmtDate(cas.retrievedAt)}
        </Field>
        <Field label="O que usamos">
          Totais acumulados de civis mortos ({fmt(cas.cumulative.killed.total)}) e feridos ({fmt(cas.cumulative.injured.total)}) por sexo e
          idade; série mensal de mortos e feridos; detalhamento por sexo do mês mais recente. “Mulheres e meninas” = mulheres + meninas da
          mesma tabela ({fmt(h.killedWG)} mortas, {fmt(h.injuredWG)} feridas).
        </Field>
        <Field label="Metodologia">
          A Missão da ONU (HRMMU) reúne informações de entrevistas com vítimas, familiares e testemunhas, imagens, registros forenses,
          processos, relatórios de organizações e dados de hospitais e autoridades locais. Só entram casos que atingem o padrão “motivos
          razoáveis para acreditar” — que a ONU chama de “verificados”. Os números podem ser revistos quando novos casos antigos são
          confirmados. A ONU afirma que o número real é “provavelmente consideravelmente maior”, sobretudo em cidades como Mariupol, onde
          houve combates intensos em 2022.
        </Field>
        <Field label="Atualização">
          Automática: um robô (GitHub Actions) consulta diariamente a página da ONU. Quando sai uma nova atualização mensal, ele lê o PDF
          oficial e só publica os números se todas as somas conferirem (por sexo, por mês e por ano). Se algo não confere, os últimos dados
          verificados permanecem.
        </Field>
      </Section>

      <Section
        id="ohchr-crsv-report"
        kicker="Violência sexual · documentação da ONU"
        title="Violência sexual relacionada ao conflito documentada pela ONU"
      >
        <Field label="Instituição">{crsv.institution}</Field>
        <Field label="Documento">
          <A href={crsv.pageUrl}>{crsv.document}</A>
          <br />
          <A href={crsv.pdfUrl}>PDF original</A>
        </Field>
        <Field label="Período dos dados">
          {fmtDate(crsv.periodStart)} a {fmtDate(crsv.periodEnd)} · publicado em {fmtDate(crsv.publishedAt)} · conferido em{' '}
          {fmtDate(crsv.retrievedAt)}
        </Field>
        <Field label="O que usamos">
          Total de {fmt(crsv.total)} casos ({crsv.totalNote}) e sua divisão por contexto e sexo (par. 16, 17, 31, 32, 42, 60, 61 e 69);
          casos de estupro contra mulheres e meninas ({fmt(crsv.rapeWomenGirls.total)}, {crsv.rapeWomenGirls.ref}); idades das vítimas (
          {crsv.rapeAgeRange.ref}); regiões com violência sexual fora de detenção ({crsv.residentialRegions.ref}).
        </Field>
        <Field label="Metodologia">
          Baseado em entrevistas confidenciais com sobreviventes, além de documentos judiciais e registros oficiais. Cada caso corresponde a
          uma pessoa sobrevivente e pode envolver vários episódios. Só foram incluídos casos com consentimento para uso público e que
          atingem o padrão “motivos razoáveis para acreditar”. A Rússia não permitiu acesso da ONU aos territórios ocupados nem aos presos
          que mantém; por isso, segundo o relatório, os números “sub-representam significativamente” o total real.
        </Field>
        <Field label="Definição">
          Segundo a ONU, violência sexual relacionada ao conflito inclui estupro, escravidão sexual, prostituição, gravidez, aborto e
          esterilização forçados, casamento forçado e outras formas de gravidade comparável — como nudez forçada, choques elétricos nos
          genitais e ameaças de violência sexual — ligadas direta ou indiretamente a um conflito.
        </Field>
      </Section>

      <Section id="pgo-crsv" kicker="Violência sexual · Justiça ucraniana" title="Fatos registrados pela Procuradoria-Geral da Ucrânia">
        <Field label="Instituição">
          {pgo.institution} · <A href={pgo.officialUrl}>gp.gov.ua</A>
        </Field>
        <Field label="O que é contado">{pgo.unit}.</Field>
        <Field label="Divulgações usadas">
          <ul className="space-y-2">
            {pgoSorted.map((s) => (
              <li key={s.date}>
                <strong className="font-semibold">{fmtDate(s.date)}</strong>: {fmt(s.total)} fatos — {fmt(s.female)} vítimas mulheres e
                meninas, {fmt(s.male)} homens e meninos ({fmt(s.minors)} menores de idade)
                {s.regions ? ', com distribuição completa por região (usada no mapa)' : ''}.
                <span className="block text-[13px]">
                  {s.sources.map((src, i) => (
                    <span key={src.url}>
                      {i > 0 && ' · '}
                      <A href={src.url}>{src.label}</A>
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </Field>
        <Field label="Observação">
          {pgo.note} O mapa usa a divulgação de {fmtDate(mapped.date)}, a mais recente com números para todas as regiões; o total nacional
          mais recente ({fmt(latest.total)}, em {fmtDate(latest.date)}) aparece ao lado do mapa. Violência sexual contra prisioneiros de
          guerra é registrada separadamente pela Procuradoria e não está incluída.
        </Field>
        <Field label="Atualização">
          Manual: quando a Procuradoria divulgar novos números, eles devem ser conferidos e adicionados ao arquivo de dados.
        </Field>
      </Section>

      <Section id="unhcr-displacement" kicker="Deslocamento forçado" title="Pessoas refugiadas e deslocadas internas (ACNUR)">
        <Field label="Instituição">{disp.institution}</Field>
        <Field label="Fonte">
          <A href={disp.pageUrl}>Refugee Data Finder</A> · <A href={`${disp.apiUrl}population/?coo=UKR`}>API pública</A>
        </Field>
        <Field label="Período dos dados">
          Situação em 31 de dezembro de cada ano, de 2021 a {disp.latest.year} · <FreshnessBadge kind={live ? 'live' : 'historical'} />
        </Field>
        <Field label="O que usamos">
          Pessoas refugiadas originárias da Ucrânia ({fmt(disp.latest.refugees.total)}) e deslocadas internas ({fmt(disp.latest.idps.total)}
          ) e, entre elas, as do sexo feminino ({fmt(disp.latest.refugees.female)} refugiadas e {fmt(disp.latest.idps.female)} deslocadas
          internas). O sexo não é informado para parte das pessoas refugiadas.
        </Field>
        <Field label="Atualização">
          Automática: a dashboard consulta a API do ACNUR diretamente no navegador. Se a API não responder, aparece o último dado verificado
          ({fmtDate(disp.retrievedAt)}).
        </Field>
      </Section>

      <Section id="mapa-base" kicker="Mapa" title="Limites das regiões da Ucrânia">
        <Field label="Fonte">
          <A href="https://www.geoboundaries.org/">geoBoundaries</A> (gbOpen, UKR ADM1), a partir de dados do{' '}
          <A href="https://www.openstreetmap.org/copyright">© OpenStreetMap</A> — licença ODbL 1.0.
        </Field>
        <Field label="Tratamento">
          24 oblasts, República Autônoma da Crimeia, cidade de Kyiv e Sebastopol, nas fronteiras internacionalmente reconhecidas da Ucrânia.
          Projeção cônica de áreas iguais e simplificação das linhas (script{' '}
          <code className="rounded bg-card-2 px-1">scripts/build-map.mjs</code>).
        </Field>
      </Section>

      <Section id="contador" kicker="Contador" title="Tempo desde o início da invasão em larga escala">
        <Field label="Referência">
          {INVASION_START_ISO.slice(0, 10).split('-').reverse().join('/')}, 00h00, horário de Kyiv (UTC+2). O contador é calculado pelo
          relógio do dispositivo e atualizado a cada segundo.
        </Field>
      </Section>

      <section className="rounded-2xl border border-line bg-card p-5 sm:p-6" aria-labelledby="leitura">
        <h2 id="leitura" className="text-[17px] font-semibold text-ink">
          Como interpretar os selos de atualização
        </h2>
        <ul className="mt-3 space-y-2 text-[14px] text-ink">
          <li className="flex flex-wrap items-center gap-2">
            <FreshnessBadge kind="recent" /> fonte publicada nos últimos 60 dias.
          </li>
          <li className="flex flex-wrap items-center gap-2">
            <FreshnessBadge kind="historical" /> último dado verificado disponível; a fonte ainda não publicou atualização.
          </li>
          <li className="flex flex-wrap items-center gap-2">
            <FreshnessBadge kind="live" /> número consultado na API pública da fonte no momento em que a página foi aberta.
          </li>
          <li className="flex flex-wrap items-center gap-2">
            <FreshnessBadge kind="recent" justUpdated /> novos dados chegaram enquanto a página estava aberta.
          </li>
        </ul>
        <h2 className="mt-6 text-[17px] font-semibold text-ink">Limitações</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-ink-2">
          <li>
            Todos os números são mínimos: contam apenas casos verificados ou registrados. A subnotificação, sobretudo de violência sexual, é
            grande.
          </li>
          <li>
            ONU e Procuradoria usam métodos e unidades diferentes (casos documentados × fatos em investigação). Por isso os números não são
            somados.
          </li>
          <li>
            Não há série temporal oficial de violência psicológica relacionada ao conflito. A categoria não é exibida para não apresentar
            dados inventados.
          </li>
          <li>Nenhum número desta dashboard é estimado, simulado ou interpolado.</li>
        </ul>
      </section>
    </>
  )
}

export default function SourcesPage() {
  const [theme, toggleTheme] = useTheme()
  const { data, status, error, displacementLive } = useDashboardData()

  return (
    <div className="flex min-h-screen flex-col">
      <Header theme={theme} onToggleTheme={toggleTheme} subtitle="Fontes e metodologia" />
      <main className="mx-auto w-full max-w-[960px] flex-1 space-y-4 px-4 py-6 sm:px-6">
        <a href="./" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent underline-offset-2 hover:underline">
          <ArrowLeft size={14} aria-hidden /> Voltar para a dashboard
        </a>
        <div>
          <h1 className="text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[32px]">Fontes, períodos e metodologia</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-2">
            Todos os números da Ciência Delas vêm de instituições oficiais. Aqui estão os documentos originais, o período coberto por cada
            dado, como ele foi produzido e como é atualizado — para que qualquer pessoa possa conferir. {CREDIT}.
          </p>
        </div>
        {data ? (
          <Content data={data} live={displacementLive} />
        ) : status === 'error' ? (
          <p role="alert" className="rounded-2xl border border-line bg-card p-5 text-ink">
            Não foi possível carregar os dados ({error}).
          </p>
        ) : (
          <div className="h-64 animate-pulse rounded-2xl border border-line bg-card" aria-busy="true" />
        )}
      </main>
      <Footer />
    </div>
  )
}
