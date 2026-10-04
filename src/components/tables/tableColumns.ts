import { SOURCE_TYPE_LABEL, STATUS_LABEL, VERIFICATION_LEVELS, VIOLENCE_TYPE_LABEL } from '../../data/labels'
import { REGION_BY_ID } from '../../data/regions'
import type { DocumentationStatus, Incident } from '../../types'
import type { Tone } from '../ui/Badge'

export type SortKey = 'date' | 'region' | 'type' | 'victim' | 'source' | 'verification' | 'status'

export function victimGroupLabel(r: Incident): string {
  return `${r.ageGroup === 'under-18' ? 'Under 18' : 'Adult'} · ${r.civilianStatus === 'displaced' ? 'Displaced' : 'Civilian'}`
}

export const COLUMNS: { key: SortKey; label: string; className?: string }[] = [
  { key: 'date', label: 'Date' },
  { key: 'region', label: 'Region' },
  { key: 'type', label: 'Type' },
  { key: 'victim', label: 'Victim group' },
  { key: 'source', label: 'Source' },
  { key: 'verification', label: 'Verification' },
  { key: 'status', label: 'Status' },
]

export const SORT_VALUE: Record<SortKey, (r: Incident) => string | number> = {
  date: (r) => r.date,
  region: (r) => REGION_BY_ID[r.region].name,
  type: (r) => VIOLENCE_TYPE_LABEL[r.type],
  victim: victimGroupLabel,
  source: (r) => SOURCE_TYPE_LABEL[r.sourceType],
  verification: (r) => VERIFICATION_LEVELS.indexOf(r.verification),
  status: (r) => STATUS_LABEL[r.status],
}

export function searchText(r: Incident): string {
  return [
    r.id,
    r.date,
    REGION_BY_ID[r.region].name,
    VIOLENCE_TYPE_LABEL[r.type],
    victimGroupLabel(r),
    SOURCE_TYPE_LABEL[r.sourceType],
    r.verification,
    STATUS_LABEL[r.status],
  ]
    .join(' ')
    .toLowerCase()
}

export const STATUS_TONE: Record<DocumentationStatus, Tone> = {
  documented: 'neutral',
  'under-review': 'warn',
  referred: 'accent',
}
