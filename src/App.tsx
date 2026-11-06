import { CasualtiesBySex } from './components/CasualtiesBySex'
import { CrsvContextChart } from './components/CrsvContextChart'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { KpiGrid } from './components/KpiGrid'
import { LiveCounter } from './components/LiveCounter'
import { ReadingNotes, SourcesBand } from './components/SourcesBand'
import { TimelinePanels } from './components/TimelinePanels'
import { UkraineMap } from './components/UkraineMap'
import { pgoSnapshots } from './data/derive'
import type { DashboardData } from './data/types'
import { useDashboardData } from './data/useDashboardData'
import { useTheme } from './theme'
import { fmtDate } from './utils/format'

function latestSourceDate(d: DashboardData): string {
  return [d.casualties.publishedAt, d.crsv.publishedAt, pgoSnapshots(d).latest.date].sort().at(-1)!
}

function Status({ data }: { data: DashboardData }) {
  return (
    <p className="flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-[11.5px] text-ink-2">
      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-recent" aria-hidden />
      Dados verificados · fonte mais recente publicada em{' '}
      <strong className="font-semibold text-ink">{fmtDate(latestSourceDate(data))}</strong>
    </p>
  )
}

/** The Ciência Delas dashboard. */
export default function App() {
  const [theme, toggleTheme] = useTheme()
  const { status, data, error, updated, displacementLive, lastCheck } = useDashboardData()

  return (
    <div className="flex min-h-screen flex-col">
      <Header theme={theme} onToggleTheme={toggleTheme} status={data ? <Status data={data} /> : null} />

      <main className="mx-auto w-full max-w-[1440px] flex-1 space-y-3 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-wrap items-end justify-between gap-2 pb-1">
          <p className="max-w-3xl text-[14px] leading-snug text-ink-2">
            O impacto da guerra na Ucrânia sobre mulheres e meninas, em números verificados por organismos da ONU e pela Justiça ucraniana.
            Cada número indica a fonte, o período e a data em que foi publicado.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          <LiveCounter className="lg:col-span-5" />
          {data ? (
            <KpiGrid data={data} updated={updated} displacementLive={displacementLive} className="lg:col-span-7" />
          ) : (
            <Placeholder status={status} error={error} className="lg:col-span-7" />
          )}
        </div>

        {data && (
          <>
            {/* Two columns on wide screens: where/when (map, timeline) · who (victims) */}
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-12 xl:items-start">
              <div className="flex min-w-0 flex-col gap-3 xl:col-span-7">
                <UkraineMap data={data} updated={updated} dark={theme === 'dark'} />
                <TimelinePanels data={data} updated={updated} displacementLive={displacementLive} />
              </div>
              <div className="flex min-w-0 flex-col gap-3 xl:col-span-5">
                <CrsvContextChart data={data} updated={updated} />
                <CasualtiesBySex data={data} updated={updated} />
                <ReadingNotes />
              </div>
            </div>
            <SourcesBand data={data} lastCheck={lastCheck} />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

function Placeholder({ status, error, className }: { status: string; error?: string; className: string }) {
  if (status === 'error')
    return (
      <div role="alert" className={`flex flex-col justify-center rounded-2xl border border-line bg-card p-6 ${className}`}>
        <p className="text-[15px] font-semibold text-ink">Não foi possível carregar os dados.</p>
        <p className="mt-1 text-[13px] text-ink-2">Verifique a conexão e recarregue a página. Detalhe técnico: {error}</p>
      </div>
    )
  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${className}`} aria-busy="true" aria-label="Carregando dados">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-[190px] animate-pulse rounded-2xl border border-line bg-card" />
      ))}
    </div>
  )
}
