import type { AgeGroup, RecordStatus, Source, Verification, VictimGroup, ViolenceType } from '../types'

export const VIOLENCE_TYPES: ViolenceType[] = ['sexual', 'physical', 'psychological', 'displacement', 'detention', 'other']

export const TYPE_LABEL: Record<ViolenceType, string> = {
  sexual: 'Sexual',
  physical: 'Physical',
  psychological: 'Psychological',
  displacement: 'Forced displacement',
  detention: 'Detention / abduction',
  other: 'Other',
}

export const VICTIM_GROUPS: VictimGroup[] = ['adult', 'under-18', 'older']

export const VICTIM_LABEL: Record<VictimGroup, string> = {
  adult: 'Adult',
  'under-18': 'Under 18',
  older: 'Older adult (60+)',
}

export const AGE_GROUPS: AgeGroup[] = ['under-18', '18-24', '25-34', '35-44', '45-54', '55+']

export const AGE_LABEL: Record<AgeGroup, string> = {
  'under-18': 'Under 18',
  '18-24': '18–24',
  '25-34': '25–34',
  '35-44': '35–44',
  '45-54': '45–54',
  '55+': '55+',
}

export const SOURCE_LABEL: Record<Source, string> = {
  'un-report': 'UN Report',
  'ngo-report': 'NGO Report',
  government: 'Government record',
  'health-facility': 'Health facility',
  'media-verified': 'Verified media',
}

export const VERIFICATIONS: Verification[] = ['verified', 'corroborated', 'reported', 'unverified']

export const VERIFICATION_LABEL: Record<Verification, string> = {
  verified: 'Verified',
  corroborated: 'Corroborated',
  reported: 'Reported',
  unverified: 'Unverified',
}

export const STATUS_LABEL: Record<RecordStatus, string> = {
  documented: 'Documented',
  'under-review': 'Under review',
  referred: 'Referred',
}
