/**
 * ============================================================================
 *  DEMO DATA — NOT OFFICIAL STATISTICS
 * ============================================================================
 *  Every record in this file is synthetic. Records are produced by a seeded
 *  pseudo-random generator so that filters, charts, the map and the table
 *  behave realistically in the prototype. They do NOT describe real events,
 *  real people or real counts, and must never be cited.
 *
 *  Records intentionally contain no personal or identifying information
 *  (no names, addresses, contact details or narrative descriptions).
 *
 *  To connect a real dataset, replace `DEMO_INCIDENTS` with records that
 *  satisfy the `Incident` type and update `DATASET_META`.
 * ============================================================================
 */
import type {
  AgeGroup,
  CivilianStatus,
  DocumentationStatus,
  Incident,
  IncidentContext,
  RegionId,
  SourceType,
  VerificationLevel,
  ViolenceType,
} from '../types'

export const DATASET_META = {
  name: 'Demonstration Dataset',
  kind: 'demo' as const,
  version: 'demo-0.3',
  conflictStart: '2022-02-24',
  disclaimer: 'Illustrative dataset generated for prototype demonstration. Not official statistics. Documented cases only.',
}

/* ----------------------------------------------------------------------------
 * Hand-written demo records (kept explicit so the structure is easy to read)
 * ------------------------------------------------------------------------- */
const HANDCRAFTED: Incident[] = [
  {
    id: 'DEMO-0001',
    date: '2024-03-12',
    region: 'kharkiv',
    type: 'sexual',
    ageGroup: '25-34',
    civilianStatus: 'civilian',
    context: 'occupied-territory',
    sourceType: 'human-rights-report',
    verification: 'corroborated',
    status: 'documented',
  },
  {
    id: 'DEMO-0002',
    date: '2022-03-18',
    region: 'kyiv',
    type: 'physical',
    ageGroup: '45-54',
    civilianStatus: 'civilian',
    context: 'occupied-territory',
    sourceType: 'un-monitoring',
    verification: 'verified',
    status: 'documented',
  },
  {
    id: 'DEMO-0003',
    date: '2022-04-02',
    region: 'chernihiv',
    type: 'detention',
    ageGroup: '35-44',
    civilianStatus: 'civilian',
    context: 'detention-facility',
    sourceType: 'un-monitoring',
    verification: 'verified',
    status: 'referred',
  },
  {
    id: 'DEMO-0004',
    date: '2022-09-21',
    region: 'kharkiv',
    type: 'psychological',
    ageGroup: '55+',
    civilianStatus: 'civilian',
    context: 'occupied-territory',
    sourceType: 'ngo-documentation',
    verification: 'corroborated',
    status: 'documented',
  },
  {
    id: 'DEMO-0005',
    date: '2022-11-14',
    region: 'kherson',
    type: 'sexual',
    ageGroup: '18-24',
    civilianStatus: 'civilian',
    context: 'occupied-territory',
    sourceType: 'human-rights-report',
    verification: 'verified',
    status: 'referred',
  },
  {
    id: 'DEMO-0006',
    date: '2023-06-08',
    region: 'lviv',
    type: 'displacement',
    ageGroup: 'under-18',
    civilianStatus: 'displaced',
    context: 'displacement-transit',
    sourceType: 'ngo-documentation',
    verification: 'reported',
    status: 'documented',
  },
  {
    id: 'DEMO-0007',
    date: '2023-10-30',
    region: 'zaporizhzhia',
    type: 'detention',
    ageGroup: '25-34',
    civilianStatus: 'civilian',
    context: 'checkpoint',
    sourceType: 'government-record',
    verification: 'corroborated',
    status: 'documented',
  },
  {
    id: 'DEMO-0008',
    date: '2025-02-17',
    region: 'donetsk',
    type: 'physical',
    ageGroup: '35-44',
    civilianStatus: 'displaced',
    context: 'hostilities',
    sourceType: 'media-verified',
    verification: 'reported',
    status: 'under-review',
  },
]

/* ----------------------------------------------------------------------------
 * Seeded generator
 * ------------------------------------------------------------------------- */
type Weighted<T> = [T, number][]

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(20220224)

function pick<T>(items: Weighted<T>): T {
  const total = items.reduce((s, [, w]) => s + w, 0)
  let r = rand() * total
  for (const [item, w] of items) {
    r -= w
    if (r <= 0) return item
  }
  return items[items.length - 1][0]
}

const REGION_WEIGHTS_EARLY: Weighted<RegionId> = [
  ['kyiv', 14],
  ['chernihiv', 10],
  ['kharkiv', 12],
  ['sumy', 6],
  ['kyiv-city', 3],
  ['zhytomyr', 3],
  ['donetsk', 8],
  ['luhansk', 6],
  ['kherson', 8],
  ['zaporizhzhia', 5],
  ['mykolaiv', 4],
  ['lviv', 2],
]
const REGION_WEIGHTS_2022: Weighted<RegionId> = [
  ['kharkiv', 10],
  ['kherson', 12],
  ['donetsk', 10],
  ['luhansk', 6],
  ['zaporizhzhia', 8],
  ['mykolaiv', 5],
  ['dnipropetrovsk', 3],
  ['odesa', 2],
  ['lviv', 3],
  ['zakarpattia', 1],
  ['chernivtsi', 1],
  ['kyiv', 2],
  ['crimea', 2],
]
const REGION_WEIGHTS_LATER: Weighted<RegionId> = [
  ['donetsk', 12],
  ['zaporizhzhia', 10],
  ['kherson', 10],
  ['kharkiv', 9],
  ['luhansk', 7],
  ['crimea', 4],
  ['dnipropetrovsk', 4],
  ['sumy', 3],
  ['odesa', 3],
  ['mykolaiv', 3],
  ['lviv', 3],
  ['kyiv-city', 2],
  ['poltava', 2],
  ['vinnytsia', 2],
  ['kyiv', 2],
  ['ivano-frankivsk', 1],
  ['ternopil', 1],
  ['khmelnytskyi', 1],
  ['rivne', 1],
  ['volyn', 1],
  ['cherkasy', 1],
  ['kirovohrad', 1],
  ['chernihiv', 1],
  ['zhytomyr', 1],
  ['zakarpattia', 1],
  ['chernivtsi', 1],
]
/** Regions far from the front line: records there are mostly displacement-linked. */
const REAR_REGIONS = new Set<RegionId>([
  'lviv',
  'volyn',
  'rivne',
  'ternopil',
  'khmelnytskyi',
  'zakarpattia',
  'ivano-frankivsk',
  'chernivtsi',
  'vinnytsia',
  'cherkasy',
  'kirovohrad',
  'poltava',
])

const TYPE_WEIGHTS: Weighted<ViolenceType> = [
  ['sexual', 22],
  ['physical', 24],
  ['psychological', 16],
  ['displacement', 16],
  ['detention', 12],
  ['other', 10],
]
const REAR_TYPE_WEIGHTS: Weighted<ViolenceType> = [
  ['displacement', 40],
  ['psychological', 20],
  ['physical', 15],
  ['sexual', 12],
  ['other', 13],
]
const AGE_WEIGHTS: Weighted<AgeGroup> = [
  ['under-18', 12],
  ['18-24', 16],
  ['25-34', 24],
  ['35-44', 20],
  ['45-54', 15],
  ['55+', 13],
]
const SOURCE_WEIGHTS: Weighted<SourceType> = [
  ['un-monitoring', 22],
  ['human-rights-report', 24],
  ['ngo-documentation', 26],
  ['government-record', 18],
  ['media-verified', 10],
]
const GENERAL_CONTEXTS: Weighted<IncidentContext> = [
  ['occupied-territory', 38],
  ['hostilities', 26],
  ['checkpoint', 16],
  ['conflict-linked-domestic', 20],
]

/** Synthetic monthly volume curve: early peak, plateau, recent reporting lag. */
function monthlyVolume(monthIndex: number, totalMonths: number): number {
  const early = [6, 15, 13, 10][monthIndex] ?? 0
  const base = early || 6 + 1.5 * Math.sin(monthIndex / 4) + (monthIndex < 24 ? 1 : 0)
  const lag = monthIndex >= totalMonths - 3 ? 0.55 : 1
  return Math.max(1, Math.round((base + (rand() - 0.5) * 3) * lag))
}

function verificationFor(monthsFromEnd: number, source: SourceType): VerificationLevel {
  // Older records have had more time to be verified; recent ones are mostly "reported".
  const maturity = Math.min(1, monthsFromEnd / 18)
  const unBoost = source === 'un-monitoring' ? 10 : 0
  return pick<VerificationLevel>([
    ['verified', 8 + 26 * maturity + unBoost],
    ['corroborated', 18 + 16 * maturity],
    ['reported', 40 - 14 * maturity],
    ['unverified', 26 - 18 * maturity],
  ])
}

function statusFor(verification: VerificationLevel): DocumentationStatus {
  if (verification === 'unverified') return 'under-review'
  if (verification === 'verified')
    return pick<DocumentationStatus>([
      ['documented', 6],
      ['referred', 4],
    ])
  return pick<DocumentationStatus>([
    ['documented', 8],
    ['under-review', 2],
    ['referred', 1],
  ])
}

function generate(): Incident[] {
  const start = new Date(Date.UTC(2022, 1, 1))
  const end = new Date(Date.UTC(2026, 8, 1))
  const totalMonths = (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + end.getUTCMonth() - start.getUTCMonth() + 1

  const out: Incident[] = []
  let seq = HANDCRAFTED.length + 1

  for (let m = 0; m < totalMonths; m++) {
    const year = start.getUTCFullYear() + Math.floor((start.getUTCMonth() + m) / 12)
    const month = (start.getUTCMonth() + m) % 12
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
    const firstDay = m === 0 ? 24 : 1 // full-scale invasion began 24 Feb 2022
    const regionWeights = m < 4 ? REGION_WEIGHTS_EARLY : m < 11 ? REGION_WEIGHTS_2022 : REGION_WEIGHTS_LATER
    const count = monthlyVolume(m, totalMonths)

    for (let i = 0; i < count; i++) {
      const day = firstDay + Math.floor(rand() * (daysInMonth - firstDay + 1))
      const region = pick(regionWeights)
      const rear = REAR_REGIONS.has(region)
      const type = pick(rear ? REAR_TYPE_WEIGHTS : TYPE_WEIGHTS)
      const context: IncidentContext =
        type === 'detention' ? 'detention-facility' : type === 'displacement' || rear ? 'displacement-transit' : pick(GENERAL_CONTEXTS)
      const civilianStatus: CivilianStatus = rear || type === 'displacement' || rand() < 0.22 ? 'displaced' : 'civilian'
      const sourceType = pick(SOURCE_WEIGHTS)
      const verification = verificationFor(totalMonths - 1 - m, sourceType)

      out.push({
        id: `DEMO-${String(seq++).padStart(4, '0')}`,
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        region,
        type,
        ageGroup: pick(AGE_WEIGHTS),
        civilianStatus,
        context,
        sourceType,
        verification,
        status: statusFor(verification),
      })
    }
  }
  return out
}

/** DEMO DATA — synthetic records sorted newest first. */
export const DEMO_INCIDENTS: Incident[] = [...HANDCRAFTED, ...generate()].sort((a, b) => b.date.localeCompare(a.date))

export const DATASET_RANGE = {
  first: DEMO_INCIDENTS.reduce((min, r) => (r.date < min ? r.date : min), DEMO_INCIDENTS[0].date),
  last: DEMO_INCIDENTS.reduce((max, r) => (r.date > max ? r.date : max), DEMO_INCIDENTS[0].date),
}
