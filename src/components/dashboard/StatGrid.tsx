import { FileText, MapPinned, MoveRight, ShieldAlert, TriangleAlert } from 'lucide-react'
import { useDashboard } from '../../context/dashboardStore'
import { regionStats, halfPeriodTrend } from '../../utils/analytics'
import { StatCard } from './StatCard'

export function StatGrid() {
  const { records, filters } = useDashboard()
  const { dateFrom, dateTo } = filters

  const isDirect = (r: (typeof records)[number]) => r.type === 'physical' || r.type === 'psychological'
  const isSexual = (r: (typeof records)[number]) => r.type === 'sexual'
  const isDisplacement = (r: (typeof records)[number]) => r.civilianStatus === 'displaced' || r.type === 'displacement'

  const affected = regionStats(records).filter((s) => s.count > 0).length

  const cards = [
    {
      title: 'Total documented incidents',
      value: records.length,
      description: 'All records in the selected period and filters',
      icon: <FileText className="h-4 w-4" />,
      trend: halfPeriodTrend(records, dateFrom, dateTo),
      accent: 'blue' as const,
      info: 'Count of synthetic incident records in the demonstration dataset matching the current filters. Trend compares the second half of the selected period with the first half.',
    },
    {
      title: 'Reported violence cases',
      value: records.filter(isDirect).length,
      description: 'Physical and psychological violence records',
      icon: <TriangleAlert className="h-4 w-4" />,
      trend: halfPeriodTrend(records, dateFrom, dateTo, isDirect),
      accent: 'amber' as const,
    },
    {
      title: 'Conflict-related sexual violence',
      value: records.filter(isSexual).length,
      description: 'Documented CRSV records — a lower bound',
      icon: <ShieldAlert className="h-4 w-4" />,
      trend: halfPeriodTrend(records, dateFrom, dateTo, isSexual),
      accent: 'red' as const,
      info: 'Conflict-related sexual violence is severely underreported. Documented records do not represent the full scale.',
    },
    {
      title: 'Affected regions',
      value: affected,
      description: 'Regions with at least one record (of 26)',
      icon: <MapPinned className="h-4 w-4" />,
      accent: 'slate' as const,
    },
    {
      title: 'Displacement-linked reports',
      value: records.filter(isDisplacement).length,
      description: 'Involving displaced women or forced displacement',
      icon: <MoveRight className="h-4 w-4" />,
      trend: halfPeriodTrend(records, dateFrom, dateTo, isDisplacement),
      accent: 'blue' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {cards.map((c, i) => (
        <StatCard key={c.title} {...c} index={i} footnote="Demo data" />
      ))}
    </div>
  )
}
