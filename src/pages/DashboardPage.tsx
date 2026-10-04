import { CrsvSection } from '../components/dashboard/CrsvSection'
import { ConflictDuration } from '../components/dashboard/ConflictDuration'
import { BriefingPanel } from '../components/dashboard/BriefingPanel'
import { DocumentationGap } from '../components/dashboard/DocumentationGap'
import { KeyObservations } from '../components/dashboard/KeyObservations'
import { MethodologyPanel } from '../components/dashboard/MethodologyPanel'
import { StatGrid } from '../components/dashboard/StatGrid'
import { TransparencyBanner } from '../components/dashboard/TransparencyBanner'
import { TimelineChart } from '../components/charts/TimelineChart'
import { VictimProfile } from '../components/charts/VictimProfile'
import { ViolenceTypeChart } from '../components/charts/ViolenceTypeChart'
import { ActiveFilters } from '../components/filters/ActiveFilters'
import { GeographicMap } from '../components/map/GeographicMap'
import { SourcesSection } from '../components/sources/SourcesSection'
import { IncidentTable } from '../components/tables/IncidentTable'
import { DataLabel } from '../components/ui/DataLabel'
import { SectionHeader } from '../components/ui/SectionHeader'
import { DATASET_META } from '../data/incidents'

export function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <TransparencyBanner />
      <ActiveFilters />

      {/* Overview */}
      <section aria-label="Overview" className="flex flex-col gap-6">
        <SectionHeader
          id="overview"
          eyebrow="01 · Overview"
          title="Situation overview"
          description="Duration of the conflict, the scale of documented records in the selection, and how much confidence they warrant."
        />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <ConflictDuration />
          <BriefingPanel />
        </div>
        <StatGrid />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <KeyObservations />
          <MethodologyPanel />
        </div>
      </section>

      <section aria-label="Violence timeline" className="flex flex-col gap-5">
        <SectionHeader
          id="timeline"
          eyebrow="02 · Timeline"
          title="Violence over time"
          description="How documented records are distributed across the selected period."
          labels={<DataLabel kind="illustrative" />}
        />
        <TimelineChart />
      </section>

      <section aria-label="Geographic analysis" className="flex flex-col gap-5">
        <SectionHeader
          id="geography"
          eyebrow="03 · Geography"
          title="Geographic distribution"
          description="Reported incidents in dataset by region. Counts are not adjusted for population, access or documentation capacity."
          labels={<DataLabel kind="limitations" />}
        />
        <GeographicMap />
      </section>

      <section aria-label="Violence types" className="flex flex-col gap-5">
        <SectionHeader
          id="types"
          eyebrow="04 · Typology"
          title="Types of reported violence"
          description="Categories follow the dataset’s own definitions; other sources may classify incidents differently."
        />
        <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
          <ViolenceTypeChart />
          <CrsvSection />
        </div>
      </section>

      <section aria-label="Victim profiles" className="flex flex-col gap-5">
        <SectionHeader
          id="victims"
          eyebrow="05 · Profiles"
          title="Victim profiles & documentation"
          description="Aggregated characteristics of records, and why documented cases capture only part of the reality."
        />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
          <VictimProfile />
          <DocumentationGap />
        </div>
        <IncidentTable />
      </section>

      <section aria-label="Sources and methodology" className="flex flex-col gap-5">
        <SectionHeader
          id="sources"
          eyebrow="06 · Sources"
          title="Sources & methodology"
          description="Where data for a production version could come from, and how confidence is graded."
          labels={<DataLabel kind="not-integrated" />}
        />
        <SourcesSection />
      </section>

      <footer className="mt-4 flex flex-col gap-2 border-t border-white/[0.06] pt-6 pb-4 text-[11.5px] text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>UKRAINE — WOMEN &amp; CONFLICT · Prototype · {DATASET_META.version}</p>
        <p className="max-w-2xl md:text-right">{DATASET_META.disclaimer}</p>
      </footer>
    </div>
  )
}
