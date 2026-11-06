import { RECENT_DAYS } from '../config'
import { daysSince } from '../utils/format'
import type { CrsvContext, DashboardData, PgoSnapshot } from './types'

export type Freshness = 'live' | 'recent' | 'historical'

/** "recent" when the source was published within RECENT_DAYS; "live" when it was just read from an API. */
export function freshness(publishedISO: string, live = false): Freshness {
  if (live) return 'live'
  return daysSince(publishedISO) <= RECENT_DAYS ? 'recent' : 'historical'
}

export const womenGirls = (c: Pick<CrsvContext, 'women' | 'girls'>) => c.women + c.girls
export const menBoys = (c: Pick<CrsvContext, 'men' | 'boys'>) => c.men + c.boys

/** Headline figures, each derived only by adding numbers published by the same source and date. */
export function headline(d: DashboardData) {
  const { killed, injured } = d.casualties.cumulative
  const crsvWomenGirls = d.crsv.contexts.reduce((s, c) => s + womenGirls(c), 0)
  const { refugees, idps } = d.displacement.latest
  return {
    killedWG: killed.women + killed.girls,
    killedTotal: killed.total,
    injuredWG: injured.women + injured.girls,
    injuredTotal: injured.total,
    crsvWG: crsvWomenGirls,
    crsvTotal: d.crsv.total,
    displacedFemale: refugees.female + idps.female,
    displacedTotal: refugees.total + idps.total,
    displacedSexKnown: refugees.female + refugees.male + idps.female + idps.male,
  }
}

/** Latest PGO announcement, and the latest one that came with a complete per-region breakdown. */
export function pgoSnapshots(d: DashboardData): { latest: PgoSnapshot; mapped: PgoSnapshot } {
  const sorted = [...d.pgo.snapshots].sort((a, b) => a.date.localeCompare(b.date))
  const latest = sorted[sorted.length - 1]
  const mapped = [...sorted].reverse().find((s) => s.regions) ?? latest
  return { latest, mapped }
}
