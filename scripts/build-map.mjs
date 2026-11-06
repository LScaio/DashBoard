/**
 * Builds the SVG geometry of Ukraine's 27 first-level administrative units
 * (24 oblasts, the Autonomous Republic of Crimea, Kyiv city and Sevastopol).
 *
 *   node scripts/build-map.mjs [path/to/geoBoundaries-UKR-ADM1_simplified.geojson]
 *
 * Without an argument the boundaries are downloaded from geoBoundaries
 * (gbOpen UKR ADM1 — source: OpenStreetMap contributors, ODbL 1.0).
 * Output: src/data/ukraine-map.json (pre-projected SVG paths, so the browser
 * ships no geographic library).
 */
import { geoArea, geoConicEqualArea, geoPath } from 'd3-geo'
import { readFile, writeFile } from 'node:fs/promises'
import polylabel from 'polylabel'
import { feature, merge } from 'topojson-client'
import { topology } from 'topojson-server'
import { presimplify, quantile, simplify } from 'topojson-simplify'

const SOURCE_URL =
  'https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/UKR/ADM1/geoBoundaries-UKR-ADM1_simplified.geojson'
const OUT = new URL('../src/data/ukraine-map.json', import.meta.url)
const WIDTH = 1000
const HEIGHT = 680
const PAD = 8

/** Portuguese display names keyed by ISO 3166-2 code. */
const NAMES = {
  'UA-05': 'Vinnytsia',
  'UA-07': 'Volyn',
  'UA-09': 'Luhansk',
  'UA-12': 'Dnipropetrovsk',
  'UA-14': 'Donetsk',
  'UA-18': 'Zhytomyr',
  'UA-21': 'Zakarpattia',
  'UA-23': 'Zaporizhzhia',
  'UA-26': 'Ivano-Frankivsk',
  'UA-30': 'Kyiv (cidade)',
  'UA-32': 'Kyiv (oblast)',
  'UA-35': 'Kirovohrad',
  'UA-40': 'Sebastopol',
  'UA-43': 'Crimeia',
  'UA-46': 'Lviv',
  'UA-48': 'Mykolaiv',
  'UA-51': 'Odesa',
  'UA-53': 'Poltava',
  'UA-56': 'Rivne',
  'UA-59': 'Sumy',
  'UA-61': 'Ternopil',
  'UA-63': 'Kharkiv',
  'UA-65': 'Kherson',
  'UA-68': 'Khmelnytskyi',
  'UA-71': 'Cherkasy',
  'UA-74': 'Chernihiv',
  'UA-77': 'Chernivtsi',
}

async function load() {
  const path = process.argv[2]
  if (path) return JSON.parse(await readFile(path, 'utf8'))
  const res = await fetch(SOURCE_URL)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)
  return res.json()
}

/** d3-geo expects clockwise exterior rings; GeoJSON (RFC 7946) uses the opposite. */
function rewind(f) {
  if (geoArea(f) <= 2 * Math.PI) return f
  const rev = (rings) => rings.map((r) => [...r].reverse())
  const g = f.geometry
  const coordinates = g.type === 'Polygon' ? rev(g.coordinates) : g.coordinates.map(rev)
  return { ...f, geometry: { ...g, coordinates } }
}

const raw = await load()
const fc = {
  type: 'FeatureCollection',
  features: raw.features.map((f) => rewind({ type: 'Feature', id: f.properties.shapeISO, properties: {}, geometry: f.geometry })),
}
if (fc.features.length !== 27) throw new Error(`Expected 27 units, got ${fc.features.length}`)
for (const f of fc.features) if (!NAMES[f.id]) throw new Error(`Unknown unit ${f.id}`)

// Simplify on a shared topology so neighbouring borders stay identical (no slivers or gaps).
let topo = topology({ regions: fc }, 1e5)
topo = presimplify(topo)
topo = simplify(topo, quantile(topo, 0.18))
const simple = feature(topo, topo.objects.regions)
const outline = merge(topo, topo.objects.regions.geometries)

const projection = geoConicEqualArea()
  .parallels([45, 51])
  .rotate([-31.5, 0])
  .fitExtent(
    [
      [PAD, PAD],
      [WIDTH - PAD, HEIGHT - PAD],
    ],
    simple,
  )
const path = geoPath(projection).digits(1)

/** Polygon area in projected px (shoelace), used to pick a MultiPolygon's main part. */
const ringArea = (ring) =>
  Math.abs(
    ring.reduce((s, [x, y], i) => {
      const [x2, y2] = ring[(i + 1) % ring.length]
      return s + x * y2 - x2 * y
    }, 0),
  ) / 2

/** Label anchor = pole of inaccessibility (the interior point farthest from any border, holes included). */
function labelPoint(f) {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
  const projected = polys.map((rings) => rings.map((ring) => ring.map((pt) => projection(pt))))
  const main = projected.reduce((a, b) => (ringArea(b[0]) > ringArea(a[0]) ? b : a))
  return polylabel(main, 0.5)
}

const regions = simple.features
  .map((f) => {
    const [lx, ly] = labelPoint(f)
    return { iso: f.id, name: NAMES[f.id], d: path(f), lx: Math.round(lx), ly: Math.round(ly) }
  })
  .sort((a, b) => a.iso.localeCompare(b.iso))

const [[x0, y0], [x1, y1]] = path.bounds(simple)
const out = {
  source: 'geoBoundaries gbOpen UKR ADM1 (OpenStreetMap contributors, ODbL 1.0)',
  width: WIDTH,
  height: Math.ceil(y1 + PAD),
  bounds: [Math.floor(x0), Math.floor(y0), Math.ceil(x1), Math.ceil(y1)],
  outline: path(outline),
  regions,
}
await writeFile(OUT, JSON.stringify(out) + '\n')
console.log(`Wrote ${regions.length} regions, ${(JSON.stringify(out).length / 1024).toFixed(1)} kB → ${OUT.pathname}`)
