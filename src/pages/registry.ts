import type { JSX } from 'react'
import type { PageId } from '../types'
import { GeographicPage, IncidentsPage, OverviewPage, SourcesPage, TimelinePage, ViolencePage, WomenPage } from './Pages'

export const PAGES: Record<PageId, () => JSX.Element> = {
  overview: OverviewPage,
  timeline: TimelinePage,
  geographic: GeographicPage,
  violence: ViolencePage,
  women: WomenPage,
  incidents: IncidentsPage,
  sources: SourcesPage,
}
