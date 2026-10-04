import { DataLimitations } from '../components/widgets/DataLimitations'
import { DocumentationGap } from '../components/widgets/DocumentationGap'
import { GeoMap } from '../components/widgets/GeoMap'
import { GroupBreakdown } from '../components/widgets/GroupBreakdown'
import { HowLongCard } from '../components/widgets/HowLongCard'
import { IncidentsOverTime } from '../components/widgets/IncidentsOverTime'
import { IncidentTable } from '../components/widgets/IncidentTable'
import { KpiRow } from '../components/widgets/KpiRow'
import { MiniTimeline } from '../components/widgets/MiniTimeline'
import { RegionTable } from '../components/widgets/RegionTable'
import { ReferenceSources, VerificationLevels } from '../components/widgets/SourcesPanel'
import { TypeTable } from '../components/widgets/TypeTable'
import { VictimProfile } from '../components/widgets/VictimProfile'
import { ViolenceTypes } from '../components/widgets/ViolenceTypes'
import { YearlyBars } from '../components/widgets/YearlyBars'

export function OverviewPage() {
  return (
    <>
      <KpiRow />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <IncidentsOverTime className="xl:col-span-8" />
        <HowLongCard className="xl:col-span-4" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <GeoMap className="xl:col-span-5" />
        <ViolenceTypes className="xl:col-span-4" />
        <VictimProfile className="xl:col-span-3" />
      </div>
      <IncidentTable />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
        <DocumentationGap className="xl:col-span-3" />
        <DataLimitations className="xl:col-span-3" />
        <MiniTimeline className="md:col-span-2 xl:col-span-6" />
      </div>
    </>
  )
}

export function TimelinePage() {
  return (
    <>
      <KpiRow />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <IncidentsOverTime className="xl:col-span-8" height={340} />
        <HowLongCard className="xl:col-span-4" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <YearlyBars className="xl:col-span-7" />
        <DocumentationGap className="xl:col-span-5" />
      </div>
      <MiniTimeline />
    </>
  )
}

export function GeographicPage() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <GeoMap className="xl:col-span-7" />
      <RegionTable className="xl:col-span-5" />
      <DataLimitations className="xl:col-span-12" />
    </div>
  )
}

export function ViolencePage() {
  return (
    <>
      <KpiRow />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <ViolenceTypes className="xl:col-span-7" height={300} />
        <TypeTable className="xl:col-span-5" />
      </div>
      <IncidentsOverTime />
    </>
  )
}

export function WomenPage() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <VictimProfile className="xl:col-span-6" />
      <GroupBreakdown className="xl:col-span-6" />
      <DocumentationGap className="xl:col-span-6" />
      <DataLimitations className="xl:col-span-6" />
    </div>
  )
}

export function IncidentsPage() {
  return <IncidentTable pageSize={15} />
}

export function SourcesPage() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <ReferenceSources className="xl:col-span-8" />
      <div className="grid grid-cols-1 gap-4 xl:col-span-4">
        <DataLimitations />
        <VerificationLevels />
      </div>
    </div>
  )
}
