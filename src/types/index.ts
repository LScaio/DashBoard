/**
 * Domain types for the Ukraine — Women & Conflict prototype.
 * All records used with these types in this repository are DEMONSTRATION DATA.
 */

export type RegionId =
  | 'volyn'
  | 'rivne'
  | 'zhytomyr'
  | 'kyiv-city'
  | 'chernihiv'
  | 'sumy'
  | 'lviv'
  | 'ternopil'
  | 'khmelnytskyi'
  | 'kyiv'
  | 'cherkasy'
  | 'poltava'
  | 'kharkiv'
  | 'zakarpattia'
  | 'ivano-frankivsk'
  | 'chernivtsi'
  | 'vinnytsia'
  | 'kirovohrad'
  | 'dnipropetrovsk'
  | 'donetsk'
  | 'luhansk'
  | 'odesa'
  | 'mykolaiv'
  | 'kherson'
  | 'zaporizhzhia'
  | 'crimea'

export interface Region {
  id: RegionId
  name: string
  /** Short label used inside map tiles */
  short: string
  /** Position on the stylised hex tile map */
  col: number
  row: number
}

export type ViolenceType = 'sexual' | 'physical' | 'psychological' | 'displacement' | 'detention' | 'other'

/** Broader groupings used by the timeline series toggle */
export type TimelineSeries = 'all' | 'sexual' | 'physical' | 'conflict' | 'other'

export type VerificationLevel = 'verified' | 'corroborated' | 'reported' | 'unverified'

export type SourceType = 'un-monitoring' | 'human-rights-report' | 'ngo-documentation' | 'government-record' | 'media-verified'

export type CivilianStatus = 'civilian' | 'displaced'

export type AgeGroup = 'under-18' | '18-24' | '25-34' | '35-44' | '45-54' | '55+'

export type IncidentContext =
  'occupied-territory' | 'detention-facility' | 'displacement-transit' | 'hostilities' | 'checkpoint' | 'conflict-linked-domestic'

export type DocumentationStatus = 'documented' | 'under-review' | 'referred'

export interface Incident {
  /** Synthetic identifier — never linked to a real case */
  id: string
  /** ISO date (YYYY-MM-DD) */
  date: string
  region: RegionId
  type: ViolenceType
  ageGroup: AgeGroup
  civilianStatus: CivilianStatus
  context: IncidentContext
  sourceType: SourceType
  verification: VerificationLevel
  status: DocumentationStatus
}

export type VictimGroupFilter = 'all' | 'civilian' | 'displaced' | 'under-18' | 'adult'

export interface Filters {
  dateFrom: string
  dateTo: string
  region: RegionId | 'all'
  type: ViolenceType | 'all'
  sourceType: SourceType | 'all'
  verification: VerificationLevel | 'all'
  victimGroup: VictimGroupFilter
}

export type ConfidenceLevel = 'High' | 'Moderate' | 'Low'

export interface RegionStat {
  region: Region
  count: number
  firstDate: string | null
  lastDate: string | null
  confidence: ConfidenceLevel
}

export interface Trend {
  /** Relative change in percent; null when the base is zero */
  pct: number | null
  direction: 'up' | 'down' | 'flat'
}
