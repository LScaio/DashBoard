import { useMemo } from 'react'
import { DataNote } from './components/DataNote'
import { DataStatus } from './components/DataStatus'
import { DataTable } from './components/DataTable'
import { Header } from './components/Header'
import { KpiCards } from './components/KpiCards'
import { ShareChart } from './components/ShareChart'
import { TimeCounter } from './components/TimeCounter'
import { TimelineChart } from './components/TimelineChart'
import { coverage } from './data/dataset'
import { useDataSource } from './hooks/useDataSource'

function Placeholder({ error }: { error: string | null }) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-2xl border border-line bg-card p-8 text-center text-sm text-ink-2">
      {error ? (
        <p>
          Não foi possível carregar <code className="text-ink">data/dados.csv</code>.
          <span className="mt-1 block text-xs text-ink-3">{error}</span>
        </p>
      ) : (
        <p className="animate-pulse">Carregando dados da planilha…</p>
      )}
    </div>
  )
}

/** The dashboard: indicators and charts first, then the full spreadsheet table they are drawn from. */
export default function App() {
  const source = useDataSource()
  const rows = source.dataset?.rows
  const span = useMemo(() => coverage(rows ?? []), [rows])

  return (
    <div className="flex min-h-screen flex-col">
      <Header source={source} coverage={span} />
      <main className="flex flex-1 flex-col gap-3 p-4 lg:px-6">
        {rows && source.dataset ? (
          <>
            <KpiCards rows={rows} />
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              <TimelineChart rows={rows} className="lg:col-span-2" />
              <TimeCounter dataEnd={span.end} />
              <ShareChart rows={rows} className="lg:col-span-2" />
              <DataStatus rows={rows} />
            </div>
            <DataNote meta={source.dataset.meta} />
            <DataTable rows={rows} />
            <p className="text-[11px] text-ink-3">
              Fonte deste painel: planilha do projeto Ciência Delas (arquivos <code>data/dados.csv</code> e <code>data/metadados.csv</code>
              ). Estimativas não são contagens oficiais e não devem ser atribuídas às instituições citadas.
            </p>
          </>
        ) : (
          <Placeholder error={source.error} />
        )}
      </main>
    </div>
  )
}
