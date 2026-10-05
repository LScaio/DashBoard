import type { ViolenceType } from '../types'

export const VIOLENCE_TYPES: ViolenceType[] = ['sexual', 'physical', 'psychological', 'displacement', 'detention', 'other']

export const TYPE_LABEL: Record<ViolenceType, string> = {
  sexual: 'Violência sexual',
  physical: 'Violência física',
  psychological: 'Violência psicológica',
  displacement: 'Deslocamento forçado',
  detention: 'Detenção / abdução',
  other: 'Outros',
}
