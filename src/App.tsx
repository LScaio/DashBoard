import { DataNote } from './components/DataNote'
import { Header } from './components/Header'
import { KpiCards } from './components/KpiCards'
import { TimeCounter } from './components/TimeCounter'
import { TimelineChart } from './components/TimelineChart'
import { UkraineMap } from './components/UkraineMap'
import { ViolenceChart } from './components/ViolenceChart'
import { DEMO_INCIDENTS } from './data/demoIncidents'
import { computeKpis } from './utils/stats'

const kpis = computeKpis(DEMO_INCIDENTS)

/** The single dashboard screen. On desktop it fits the viewport height. */
export default function App() {
  return (
    <div className="flex min-h-screen flex-col fit:h-screen">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col gap-3 p-4 lg:px-6">
        <KpiCards kpis={kpis} />
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-3 fit:grid-rows-2">
          <TimelineChart records={DEMO_INCIDENTS} className="lg:col-span-2" />
          <TimeCounter />
          <ViolenceChart records={DEMO_INCIDENTS} className="lg:col-span-2" />
          <UkraineMap records={DEMO_INCIDENTS} />
        </div>
        <DataNote />
      </main>
    </div>
  )
}
