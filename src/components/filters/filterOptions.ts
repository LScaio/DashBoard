import {
  SOURCE_TYPES,
  SOURCE_TYPE_LABEL,
  VERIFICATION_LABEL,
  VICTIM_GROUP_LABEL,
  VIOLENCE_TYPES,
  VIOLENCE_TYPE_LABEL,
} from '../../data/labels'
import { REGIONS_ALPHABETICAL } from '../../data/regions'
import type { Filters, VictimGroupFilter } from '../../types'

export const REGION_OPTIONS: { value: Filters['region']; label: string }[] = [
  { value: 'all', label: 'All regions' },
  ...REGIONS_ALPHABETICAL.map((r) => ({ value: r.id, label: r.name })),
]

export const TYPE_OPTIONS: { value: Filters['type']; label: string }[] = [
  { value: 'all', label: 'All types' },
  ...VIOLENCE_TYPES.map((t) => ({ value: t, label: VIOLENCE_TYPE_LABEL[t] })),
]

export const SOURCE_OPTIONS: { value: Filters['sourceType']; label: string }[] = [
  { value: 'all', label: 'All sources' },
  ...SOURCE_TYPES.map((s) => ({ value: s, label: SOURCE_TYPE_LABEL[s] })),
]

export const VERIFICATION_OPTIONS: { value: Filters['verification']; label: string }[] = [
  { value: 'all', label: 'All' },
  ...(['verified', 'corroborated', 'reported'] as const).map((v) => ({ value: v, label: VERIFICATION_LABEL[v] })),
]

export const VICTIM_OPTIONS: { value: VictimGroupFilter; label: string }[] = (
  ['all', 'civilian', 'displaced', 'under-18', 'adult'] as const
).map((v) => ({ value: v, label: VICTIM_GROUP_LABEL[v] }))
