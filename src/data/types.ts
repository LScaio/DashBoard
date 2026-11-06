/**
 * Shapes of the files in public/data/. Every number in them is copied from a
 * dated official source (see each file's `institution`, `document`, URLs).
 * Nothing is estimated or simulated; see /fontes.html for the methodology.
 */

export type DatasetId = 'ohchr-civilian-casualties' | 'ohchr-crsv-report' | 'pgo-crsv' | 'unhcr-displacement'
export type UpdateMethod = 'automatic' | 'manual' | 'api'

interface SourceMeta {
  id: DatasetId
  institution: string
  retrievedAt: string
  updateMethod: UpdateMethod
  unit: string
}

export interface CasualtyGroups {
  men: number
  women: number
  adultsUnknown: number
  boys: number
  girls: number
  childrenUnknown: number
  total: number
}

export interface MonthGroups {
  men: number
  women: number
  boys: number
  girls: number
  total: number
}

export interface CivilianCasualties extends SourceMeta {
  document: string
  pageUrl: string
  pdfUrl: string
  listUrl: string
  publishedAt: string
  periodStart: string
  periodEnd: string
  cumulative: { killed: CasualtyGroups; injured: CasualtyGroups }
  latestMonth: { month: string; killed: MonthGroups; injured: MonthGroups }
  monthly: { month: string; killed: number; injured: number }[]
}

export type CrsvContextId = 'pow' | 'civ-detention' | 'civ-residential' | 'pre-2022' | 'ua-pow' | 'ua-detainees'

export interface CrsvContext {
  id: CrsvContextId
  label: string
  perpetrator: 'russia' | 'ukraine'
  women: number
  girls: number
  men: number
  boys: number
  ref: string
}

export interface CrsvReport extends SourceMeta {
  document: string
  pageUrl: string
  pdfUrl: string
  publishedAt: string
  periodStart: string
  periodEnd: string
  total: number
  totalNote: string
  contexts: CrsvContext[]
  byPerpetrator: Record<
    'russia' | 'ukraine',
    { label: string; total: number; women: number; girls: number; men: number; boys: number; ref: string }
  >
  rapeWomenGirls: {
    total: number
    gangRape: number
    ref: string
    parts: { context: CrsvContextId; women: number; girls: number; gangRape: number }[]
  }
  rapeAgeRange: { min: number; max: number; context: CrsvContextId; ref: string }
  residentialRegions: { iso: string[]; ref: string }
}

export interface Link {
  label: string
  url: string
}

export interface PgoSnapshot {
  date: string
  total: number
  /** Female victims (women and girls) */
  female: number
  /** Male victims (men and boys) */
  male: number
  minors: number
  /** Facts per region (ISO 3166-2), only when the full breakdown was published */
  regions?: Record<string, number>
  sources: Link[]
}

export interface PgoCrsv extends SourceMeta {
  officialUrl: string
  note: string
  snapshots: PgoSnapshot[]
}

export interface DisplacementYear {
  year: number
  refugees: number
  idps: number
}

export interface SexSplit {
  total: number
  female: number
  male: number
}

export interface Displacement extends SourceMeta {
  document: string
  apiUrl: string
  pageUrl: string
  years: DisplacementYear[]
  latest: { year: number; refugees: SexSplit; idps: SexSplit }
}

export interface Manifest {
  version: string
  datasets: DatasetId[]
}

export interface DashboardData {
  casualties: CivilianCasualties
  crsv: CrsvReport
  pgo: PgoCrsv
  displacement: Displacement
}
