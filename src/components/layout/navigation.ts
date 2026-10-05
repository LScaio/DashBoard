import { Clock3, Crosshair, Info, LayoutDashboard, Table2, TriangleAlert, UserRound } from 'lucide-react'
import type { PageId } from '../../types'

export const NAV: { id: PageId; label: string; Icon: typeof Info }[] = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'timeline', label: 'Timeline', Icon: Clock3 },
  { id: 'geographic', label: 'Geographic', Icon: Crosshair },
  { id: 'violence', label: 'Violence', Icon: TriangleAlert },
  { id: 'women', label: 'Women', Icon: UserRound },
  { id: 'incidents', label: 'Incidents', Icon: Table2 },
  { id: 'sources', label: 'Sources', Icon: Info },
]
