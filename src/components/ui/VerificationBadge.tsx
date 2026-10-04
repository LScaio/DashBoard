import { CircleCheck, CircleDashed, CircleDot, CircleHelp } from 'lucide-react'
import { VERIFICATION_DESCRIPTION, VERIFICATION_LABEL } from '../../data/labels'
import type { VerificationLevel } from '../../types'
import { Badge, type Tone } from './Badge'

const TONE: Record<VerificationLevel, Tone> = {
  verified: 'ok',
  corroborated: 'accent',
  reported: 'warn',
  unverified: 'muted',
}

const ICON: Record<VerificationLevel, typeof CircleCheck> = {
  verified: CircleCheck,
  corroborated: CircleDot,
  reported: CircleDashed,
  unverified: CircleHelp,
}

export const VERIFICATION_TONE = TONE

export function VerificationBadge({ level }: { level: VerificationLevel }) {
  const Icon = ICON[level]
  return (
    <Badge tone={TONE[level]} icon={<Icon className="h-3 w-3" aria-hidden />} title={VERIFICATION_DESCRIPTION[level]}>
      {VERIFICATION_LABEL[level]}
    </Badge>
  )
}
