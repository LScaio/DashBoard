import { BarChart3, BookOpen, Clock, LayoutDashboard, Map, Users } from 'lucide-react'

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'timeline', label: 'Violence Timeline', Icon: Clock },
  { id: 'geography', label: 'Geographic Analysis', Icon: Map },
  { id: 'types', label: 'Violence Types', Icon: BarChart3 },
  { id: 'victims', label: 'Victim Profiles', Icon: Users },
  { id: 'sources', label: 'Sources & Methodology', Icon: BookOpen },
] as const

export const NAV_IDS: string[] = NAV_ITEMS.map((i) => i.id)
