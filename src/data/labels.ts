import type {
  AgeGroup,
  CivilianStatus,
  DocumentationStatus,
  IncidentContext,
  SourceType,
  TimelineSeries,
  VerificationLevel,
  VictimGroupFilter,
  ViolenceType,
} from '../types'

export const VIOLENCE_TYPES: ViolenceType[] = ['sexual', 'physical', 'psychological', 'displacement', 'detention', 'other']

export const VIOLENCE_TYPE_LABEL: Record<ViolenceType, string> = {
  sexual: 'Sexual violence',
  physical: 'Physical violence',
  psychological: 'Psychological violence',
  displacement: 'Forced displacement',
  detention: 'Abduction / detention-related abuse',
  other: 'Other',
}

export const VIOLENCE_TYPE_SHORT: Record<ViolenceType, string> = {
  sexual: 'Sexual',
  physical: 'Physical',
  psychological: 'Psychological',
  displacement: 'Displacement',
  detention: 'Detention-related',
  other: 'Other',
}

/**
 * Categorical palette (fixed order, validated for colour-vision deficiency on
 * the dark surface). Colour follows the category, never its rank.
 */
export const VIOLENCE_TYPE_COLOR: Record<ViolenceType, string> = {
  sexual: '#3987e5',
  physical: '#d95926',
  psychological: '#199e70',
  displacement: '#c98500',
  detention: '#d55181',
  other: '#9085e9',
}

export const TIMELINE_SERIES: { id: TimelineSeries; label: string; types: ViolenceType[] }[] = [
  { id: 'all', label: 'All incidents', types: VIOLENCE_TYPES },
  { id: 'sexual', label: 'Sexual violence', types: ['sexual'] },
  { id: 'physical', label: 'Physical violence', types: ['physical'] },
  { id: 'conflict', label: 'Conflict-related violence', types: ['displacement', 'detention'] },
  { id: 'other', label: 'Other reported violence', types: ['psychological', 'other'] },
]

export const VERIFICATION_LEVELS: VerificationLevel[] = ['verified', 'corroborated', 'reported', 'unverified']

export const VERIFICATION_LABEL: Record<VerificationLevel, string> = {
  verified: 'Verified',
  corroborated: 'Corroborated',
  reported: 'Reported',
  unverified: 'Unverified',
}

export const VERIFICATION_DESCRIPTION: Record<VerificationLevel, string> = {
  verified: 'Independently confirmed by a monitoring body applying a defined standard of proof.',
  corroborated: 'Supported by two or more independent sources, not yet formally verified.',
  reported: 'Recorded from a single credible source; not independently confirmed.',
  unverified: 'Received but not yet assessed; may be incomplete or duplicated.',
}

export const SOURCE_TYPES: SourceType[] = [
  'un-monitoring',
  'human-rights-report',
  'ngo-documentation',
  'government-record',
  'media-verified',
]

export const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  'un-monitoring': 'UN monitoring report',
  'human-rights-report': 'Human rights report',
  'ngo-documentation': 'NGO documentation',
  'government-record': 'Government record',
  'media-verified': 'Verified media report',
}

export const AGE_GROUPS: AgeGroup[] = ['under-18', '18-24', '25-34', '35-44', '45-54', '55+']

export const AGE_GROUP_LABEL: Record<AgeGroup, string> = {
  'under-18': 'Under 18',
  '18-24': '18–24',
  '25-34': '25–34',
  '35-44': '35–44',
  '45-54': '45–54',
  '55+': '55+',
}

export const CIVILIAN_STATUS_LABEL: Record<CivilianStatus, string> = {
  civilian: 'Civilian (resident)',
  displaced: 'Displaced',
}

export const CONTEXTS: IncidentContext[] = [
  'occupied-territory',
  'detention-facility',
  'displacement-transit',
  'hostilities',
  'checkpoint',
  'conflict-linked-domestic',
]

export const CONTEXT_LABEL: Record<IncidentContext, string> = {
  'occupied-territory': 'Occupied territory',
  'detention-facility': 'Detention / filtration',
  'displacement-transit': 'Displacement / transit',
  hostilities: 'Active hostilities',
  checkpoint: 'Checkpoint',
  'conflict-linked-domestic': 'Conflict-linked domestic',
}

export const STATUS_LABEL: Record<DocumentationStatus, string> = {
  documented: 'Documented',
  'under-review': 'Under review',
  referred: 'Referred',
}

export const VICTIM_GROUP_LABEL: Record<VictimGroupFilter, string> = {
  all: 'All',
  civilian: 'Civilian',
  displaced: 'Displaced',
  'under-18': 'Under 18',
  adult: 'Adult',
}
