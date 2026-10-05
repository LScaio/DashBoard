/** Domain types for the Ciência Delas dashboard prototype. All records are DEMO DATA. */

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
  /** Short code shown inside the map tile */
  short: string
  /** Position on the hex-tile map */
  col: number
  row: number
}

export type ViolenceType = 'sexual' | 'physical' | 'psychological' | 'displacement' | 'detention' | 'other'

export type VictimGroup = 'adult' | 'under-18' | 'older'

export type AgeGroup = 'under-18' | '18-24' | '25-34' | '35-44' | '45-54' | '55+'

export type Source = 'un-report' | 'ngo-report' | 'government' | 'health-facility' | 'media-verified'

export type Verification = 'verified' | 'corroborated' | 'reported' | 'unverified'

export type RecordStatus = 'documented' | 'under-review' | 'referred'

export interface Incident {
  /** Synthetic identifier — never linked to a real case */
  id: string
  /** ISO date (YYYY-MM-DD) */
  date: string
  region: RegionId
  type: ViolenceType
  victimGroup: VictimGroup
  /** Only available for a subset of records */
  ageGroup: AgeGroup | null
  source: Source
  verification: Verification
  status: RecordStatus
}
