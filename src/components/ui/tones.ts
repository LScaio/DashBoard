import type { Confidence, RecordStatus, Verification } from '../../types'

export type Tone = 'primary' | 'ok' | 'warn' | 'alert' | 'muted'

export const VERIFICATION_TONE: Record<Verification, Tone> = {
  verified: 'ok',
  corroborated: 'primary',
  reported: 'warn',
  unverified: 'muted',
}
export const STATUS_TONE: Record<RecordStatus, Tone> = { documented: 'muted', 'under-review': 'warn', referred: 'primary' }
export const CONFIDENCE_TONE: Record<Confidence, Tone> = { High: 'ok', Medium: 'primary', Low: 'warn' }
