import type { Region, RegionId } from '../types'

/**
 * Ukraine's administrative regions placed on a stylised hex-tile map
 * (west→east, north→south). Schematic cartogram — not cartographically exact.
 */
export const REGIONS: Region[] = [
  { id: 'volyn', name: 'Volyn', short: 'VOL', col: 1, row: 0 },
  { id: 'rivne', name: 'Rivne', short: 'RIV', col: 2, row: 0 },
  { id: 'zhytomyr', name: 'Zhytomyr', short: 'ZHY', col: 3, row: 0 },
  { id: 'kyiv-city', name: 'Kyiv (cidade)', short: 'KYC', col: 4, row: 0 },
  { id: 'chernihiv', name: 'Chernihiv', short: 'CHE', col: 5, row: 0 },
  { id: 'sumy', name: 'Sumy', short: 'SUM', col: 6, row: 0 },

  { id: 'lviv', name: 'Lviv', short: 'LVI', col: 0, row: 1 },
  { id: 'ternopil', name: 'Ternopil', short: 'TER', col: 1, row: 1 },
  { id: 'khmelnytskyi', name: 'Khmelnytskyi', short: 'KHM', col: 2, row: 1 },
  { id: 'kyiv', name: 'Oblast de Kyiv', short: 'KYI', col: 3, row: 1 },
  { id: 'cherkasy', name: 'Cherkasy', short: 'CHK', col: 4, row: 1 },
  { id: 'poltava', name: 'Poltava', short: 'POL', col: 5, row: 1 },
  { id: 'kharkiv', name: 'Kharkiv', short: 'KHA', col: 6, row: 1 },

  { id: 'zakarpattia', name: 'Zakarpattia', short: 'ZAK', col: 0, row: 2 },
  { id: 'ivano-frankivsk', name: 'Ivano-Frankivsk', short: 'IFR', col: 1, row: 2 },
  { id: 'chernivtsi', name: 'Chernivtsi', short: 'CHV', col: 2, row: 2 },
  { id: 'vinnytsia', name: 'Vinnytsia', short: 'VIN', col: 3, row: 2 },
  { id: 'kirovohrad', name: 'Kirovohrad', short: 'KIR', col: 4, row: 2 },
  { id: 'dnipropetrovsk', name: 'Dnipropetrovsk', short: 'DNI', col: 5, row: 2 },
  { id: 'donetsk', name: 'Donetsk', short: 'DON', col: 6, row: 2 },
  { id: 'luhansk', name: 'Luhansk', short: 'LUH', col: 7, row: 2 },

  { id: 'odesa', name: 'Odessa', short: 'ODE', col: 3, row: 3 },
  { id: 'mykolaiv', name: 'Mykolaiv', short: 'MYK', col: 4, row: 3 },
  { id: 'kherson', name: 'Kherson', short: 'KHE', col: 5, row: 3 },
  { id: 'zaporizhzhia', name: 'Zaporizhzhia', short: 'ZAP', col: 6, row: 3 },

  { id: 'crimea', name: 'Crimeia', short: 'CRI', col: 6, row: 4 },
]

export const REGION_BY_ID: Record<RegionId, Region> = Object.fromEntries(REGIONS.map((r) => [r.id, r])) as Record<RegionId, Region>
