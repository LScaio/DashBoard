#!/usr/bin/env node
/**
 * Scheduled data refresh for Ciência Delas (run by .github/workflows/update-data.yml).
 *
 * Rule: never invent or estimate. A dataset file is replaced only when the
 * official source has published something newer AND every integrity check
 * passes. If anything is off, the last verified file stays untouched and the
 * run prints a warning.
 *
 *  1. ONU/ACNUDH (HRMMU) — monthly "Protection of Civilians in Armed Conflict"
 *     update. There is no API, so the official PDF is read with poppler's
 *     `pdftotext -bbox` (word coordinates) and the charts' numbers are matched
 *     to their labels by position. Cross-checks: cumulative totals by sex/age
 *     = sum of the monthly table = headline totals; latest month by sex =
 *     latest month in the table.
 *  2. ACNUR (UNHCR) — public population API (refugees/IDPs from Ukraine).
 *
 * Usage:
 *   node scripts/update-data.mjs                 # check sources, update files if needed
 *   node scripts/update-data.mjs --dry-run       # report only
 *   node scripts/update-data.mjs --pdf FILE --page-url URL [--published YYYY-MM-DD]   # parse a local PDF (testing)
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const DATA_DIR = new URL('../public/data/', import.meta.url)
const OHCHR_BASE = 'https://ukraine.ohchr.org'
const OHCHR_LIST = `${OHCHR_BASE}/en/reports/protection-of-civilians`
const UNHCR_API = 'https://api.unhcr.org/population/v1/'
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const ABBR = MONTHS.map((m) => m.slice(0, 3))

const args = process.argv.slice(2)
const flag = (name) => args.includes(name)
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined)
const DRY = flag('--dry-run')
const today = new Date().toISOString().slice(0, 10)

const readJson = (file) => JSON.parse(readFileSync(new URL(file, DATA_DIR), 'utf8'))
const writeJson = (file, data) => writeFileSync(new URL(file, DATA_DIR), JSON.stringify(data, null, 1) + '\n')
const warn = (msg) => console.log(process.env.GITHUB_ACTIONS ? `::warning::${msg}` : `WARNING: ${msg}`)

class CheckError extends Error {}
function check(cond, msg) {
  if (!cond) throw new CheckError(msg)
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'ciencia-delas-data-bot (+https://github.com/LScaio/DashBoard)' } })
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  return res.text()
}

/* ------------------------------------------------------------------ */
/* PDF words with coordinates                                          */
/* ------------------------------------------------------------------ */

function pdfPages(pdfPath) {
  const out = execFileSync('pdftotext', ['-bbox', pdfPath, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  return out
    .split('<page ')
    .slice(1)
    .map((chunk) =>
      [...chunk.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({
        x0: +m[1],
        y0: +m[2],
        x1: +m[3],
        y1: +m[4],
        t: m[5].replace(/&amp;/g, '&'),
        cx: (+m[1] + +m[3]) / 2,
      })),
    )
}

const NUM = /^\d{1,3}(,\d{3})+\*{0,2}$|^\d+\*{0,2}$/
const isNum = (w) => NUM.test(w.t)
const val = (w) => Number(w.t.replace(/[,*]/g, ''))

/** Axis tick columns: ≥4 right-aligned numbers forming an arithmetic sequence that starts at 0. */
function tickWords(words) {
  const nums = words.filter(isNum)
  const ticks = new Set()
  for (const w of nums) {
    // Same right edge and within one chart's height (a stray number elsewhere on the page can share the edge).
    const col = nums.filter((o) => Math.abs(o.x1 - w.x1) < 0.8 && Math.abs(o.y0 - w.y0) < 110)
    if (col.length < 4) continue
    const vs = [...new Set(col.map(val))].sort((a, b) => a - b)
    const step = vs[1] - vs[0]
    if (vs[0] === 0 && step > 0 && vs.every((v, i) => v === i * step)) col.forEach((o) => ticks.add(o))
  }
  return ticks
}

/**
 * "By age and sex" bar chart: each group label (Men, Women, Sex … unknown,
 * Boys, Girls) has two value labels above it — killed (left) and injured (right).
 */
function parseAgeSex(words) {
  const labels = []
  for (let i = 0; i < words.length; i++) {
    const w = words[i]
    if (['Men', 'Women', 'Boys', 'Girls'].includes(w.t)) labels.push({ key: w.t, x0: w.x0, x1: w.x1, y: w.y0 })
    if (w.t === 'Sex') {
      const end = words.slice(i, i + 6).find((o) => o.t === 'unknown' && Math.abs(o.y0 - w.y0) < 2)
      if (end) labels.push({ key: 'Unknown', x0: w.x0, x1: end.x1, y: w.y0 })
    }
  }
  check(
    ['Men', 'Women', 'Boys', 'Girls'].every((k) => labels.some((l) => l.key === k)),
    'age/sex labels not found',
  )
  const y = labels.find((l) => l.key === 'Men').y
  const row = labels.filter((l) => Math.abs(l.y - y) < 3).sort((a, b) => a.x0 - b.x0)
  const ticks = tickWords(words)
  // The chart starts at its "BY AGE AND SEX" heading; never look above it (the monthly table sits there).
  const heading = words.filter((w) => w.t === 'AGE' && w.y0 < y).sort((a, b) => b.y0 - a.y0)[0]
  const top = heading ? heading.y0 : y - 260
  const values = words.filter((w) => isNum(w) && !ticks.has(w) && w.y0 < y - 2 && w.y0 > top)
  const xMin = row[0].x0 - 30
  const xMax = row[row.length - 1].x1 + 30
  const groups = row.map((l) => ({ ...l, cx: (l.x0 + l.x1) / 2, vals: [] }))
  for (const v of values) {
    if (v.cx < xMin || v.cx > xMax) continue
    const g = groups.reduce((a, b) => (Math.abs(b.cx - v.cx) < Math.abs(a.cx - v.cx) ? b : a))
    if (Math.abs(g.cx - v.cx) <= 32) g.vals.push(v)
  }
  const out = {}
  let unknownSeen = 0
  for (const g of groups) {
    check(g.vals.length === 2, `age/sex group "${g.key}" has ${g.vals.length} values (expected killed + injured)`)
    const [killed, injured] = g.vals.sort((a, b) => a.cx - b.cx).map(val)
    // The first "Sex is yet unknown" group belongs to adults (left of Boys), the second to children.
    const key =
      g.key === 'Unknown' ? (g.cx < groups.find((o) => o.key === 'Boys').cx ? 'adultsUnknown' : 'childrenUnknown') : g.key.toLowerCase()
    if (g.key === 'Unknown') unknownSeen++
    out[key] = { killed, injured }
  }
  check(unknownSeen <= 2, 'unexpected number of "sex unknown" groups')
  return out
}

/** Monthly table: month abbreviations in a header row, year labels on the left, killed above injured. */
function parseMonthlyTable(words) {
  const heads = words.filter((w) => ABBR.includes(w.t))
  const headerY = heads.map((h) => Math.round(h.y0)).find((y, _, all) => all.filter((o) => Math.abs(o - y) < 2).length >= 12)
  check(headerY !== undefined, 'monthly table header not found')
  const cols = ABBR.map((a) => heads.find((h) => h.t === a && Math.abs(h.y0 - headerY) < 2))
  const left = cols[0].x0 - 20
  const years = words.filter((w) => /^20\d\d$/.test(w.t) && w.y0 > headerY && w.x1 < left + 5).sort((a, b) => a.y0 - b.y0)
  check(years.length >= 4, 'monthly table year labels not found')
  const ticks = tickWords(words)
  const rows = []
  years.forEach((yw, i) => {
    const yTop = yw.y0 - 4
    const yBot = i + 1 < years.length ? years[i + 1].y0 - 4 : yw.y0 + 26
    const cells = words.filter((w) => isNum(w) && !ticks.has(w) && w.y0 >= yTop && w.y0 < yBot && w.x0 > left)
    const lineYs = [...new Set(cells.map((c) => Math.round(c.y0)))].sort((a, b) => a - b)
    const top = lineYs[0]
    const killedLine = cells.filter((c) => Math.abs(c.y0 - top) < 4)
    const injuredLine = cells.filter((c) => Math.abs(c.y0 - top) >= 4)
    const toMonth = (c) => cols.reduce((best, h, m) => (Math.abs(h.cx - c.cx) < Math.abs(cols[best].cx - c.cx) ? m : best), 0)
    const k = new Map(killedLine.map((c) => [toMonth(c), val(c)]))
    const j = new Map(injuredLine.map((c) => [toMonth(c), val(c)]))
    check(k.size === killedLine.length && j.size === injuredLine.length, `duplicate month cells in ${yw.t}`)
    const keys = (mp) => [...mp.keys()].sort((a, b) => a - b).join()
    check(keys(k) === keys(j), `killed/injured months differ in ${yw.t}`)
    for (const m of [...k.keys()].sort((a, b) => a - b))
      rows.push({ month: `${yw.t}-${String(m + 1).padStart(2, '0')}`, killed: k.get(m), injured: j.get(m) })
  })
  rows.sort((a, b) => a.month.localeCompare(b.month))
  check(rows[0].month === '2022-02', `monthly table should start in 2022-02, got ${rows[0].month}`)
  for (let i = 1; i < rows.length; i++) {
    const [y, m] = rows[i - 1].month.split('-').map(Number)
    const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`
    check(rows[i].month === next, `gap in monthly table after ${rows[i - 1].month}`)
  }
  return rows
}

/** Headline "since 24 February 2022": the three numbers where killed + injured = total. */
function parseHeadline(words, belowY) {
  const nums = words.filter((w) => isNum(w) && w.y0 < belowY).map(val)
  for (const total of [...new Set(nums)].sort((a, b) => b - a))
    for (const a of nums) if (a < total && nums.includes(total - a) && a < total - a) return { killed: a, injured: total - a, total }
  throw new CheckError('headline totals not found')
}

function sumGroups(groups, kind) {
  return Object.values(groups).reduce((s, g) => s + g[kind], 0)
}

export function parseCasualtiesPdf(pdfPath, reportMonth) {
  const pages = pdfPages(pdfPath)
  const text = (p) => p.map((w) => w.t).join(' ')
  const cumPage = pages.find((p) => /SINCE 24 FEBRUARY 2022/.test(text(p)))
  check(cumPage, 'cumulative page not found')
  const monthName = MONTHS[Number(reportMonth.slice(5, 7)) - 1].toUpperCase()
  const monthPage = pages.find(
    (p) => p !== cumPage && new RegExp(`CIVILIAN CASUALTIES ${monthName} ${reportMonth.slice(0, 4)}`).test(text(p)),
  )
  check(monthPage, `page for ${monthName} ${reportMonth.slice(0, 4)} not found`)

  const ageSex = parseAgeSex(cumPage)
  const monthly = parseMonthlyTable(cumPage)
  const byYearLabel = cumPage.find((w) => w.t === 'YEAR' || w.t === 'YEAR*')
  const head = parseHeadline(cumPage, byYearLabel ? byYearLabel.y0 : 160)
  const latest = parseAgeSex(monthPage)

  const g = (k) => ageSex[k] ?? { killed: 0, injured: 0 }
  const cumulative = {}
  for (const kind of ['killed', 'injured']) {
    cumulative[kind] = {
      men: g('men')[kind],
      women: g('women')[kind],
      adultsUnknown: g('adultsUnknown')[kind],
      boys: g('boys')[kind],
      girls: g('girls')[kind],
      childrenUnknown: g('childrenUnknown')[kind],
      total: sumGroups(ageSex, kind),
    }
  }
  const lastRow = monthly[monthly.length - 1]
  const lg = (k) => latest[k] ?? { killed: 0, injured: 0 }
  const latestMonth = { month: lastRow.month }
  for (const kind of ['killed', 'injured']) {
    latestMonth[kind] = {
      men: lg('men')[kind],
      women: lg('women')[kind],
      boys: lg('boys')[kind],
      girls: lg('girls')[kind],
      total: sumGroups(latest, kind),
    }
  }

  // Integrity checks — every one must hold.
  check(lastRow.month === reportMonth, `monthly table ends in ${lastRow.month}, report is ${reportMonth}`)
  for (const kind of ['killed', 'injured']) {
    const monthlySum = monthly.reduce((s, r) => s + r[kind], 0)
    check(cumulative[kind].total === head[kind], `${kind}: age/sex sum ${cumulative[kind].total} ≠ headline ${head[kind]}`)
    check(monthlySum === head[kind], `${kind}: monthly sum ${monthlySum} ≠ headline ${head[kind]}`)
    check(latestMonth[kind].total === lastRow[kind], `${kind}: latest month by sex ${latestMonth[kind].total} ≠ table ${lastRow[kind]}`)
  }
  return { cumulative, latestMonth, monthly }
}

/* ------------------------------------------------------------------ */
/* Source 1: OHCHR monthly update                                      */
/* ------------------------------------------------------------------ */

async function latestOhchrReport() {
  const html = await fetchText(OHCHR_LIST)
  const pages = [...html.matchAll(/href="(\/en\/Protection-of-Civilians-in-Armed-Conflict-([A-Za-z]+)-(\d{4}))"/g)]
    .map((m) => ({ path: m[1], month: MONTHS.indexOf(m[2]) + 1, year: Number(m[3]) }))
    .filter((p) => p.month > 0)
    .sort((a, b) => b.year - a.year || b.month - a.month)
  check(pages.length, 'no monthly update links on the OHCHR list page')
  const top = pages[0]
  const pageUrl = OHCHR_BASE + top.path
  const page = await fetchText(pageUrl)
  const pdf = page.match(/href="([^"]+_ENG\.pdf)"/)
  check(pdf, `no English PDF on ${pageUrl}`)
  const date = page.match(/<time datetime="(\d{4}-\d{2}-\d{2})/)
  return {
    pageUrl,
    pdfUrl: new URL(pdf[1], OHCHR_BASE).href,
    reportMonth: `${top.year}-${String(top.month).padStart(2, '0')}`,
    publishedAt: date ? date[1] : today,
  }
}

function lastDay(month) {
  const [y, m] = month.split('-').map(Number)
  return `${month}-${String(new Date(Date.UTC(y, m, 0)).getUTCDate()).padStart(2, '0')}`
}

async function updateCasualties() {
  const file = 'ohchr-civilian-casualties.json'
  const current = readJson(file)
  let report
  if (opt('--pdf')) {
    const pageUrl = opt('--page-url') ?? current.pageUrl
    const m = pageUrl.match(/Conflict-([A-Za-z]+)-(\d{4})/)
    report = {
      pageUrl,
      pdfUrl: current.pdfUrl,
      reportMonth: `${m[2]}-${String(MONTHS.indexOf(m[1]) + 1).padStart(2, '0')}`,
      publishedAt: opt('--published') ?? today,
      local: opt('--pdf'),
    }
  } else {
    report = await latestOhchrReport()
    if (report.pageUrl === current.pageUrl) {
      console.log(`OHCHR: no new monthly update (latest is still ${report.reportMonth}).`)
      return false
    }
  }
  console.log(`OHCHR: parsing ${report.reportMonth} update…`)
  let pdfPath = report.local
  if (!pdfPath) {
    const res = await fetch(report.pdfUrl)
    if (!res.ok) throw new Error(`PDF download failed: HTTP ${res.status}`)
    pdfPath = join(mkdtempSync(join(tmpdir(), 'ohchr-')), 'update.pdf')
    writeFileSync(pdfPath, Buffer.from(await res.arrayBuffer()))
  }
  const parsed = parseCasualtiesPdf(pdfPath, report.reportMonth)
  // Sanity: cumulative numbers never shrink by more than revisions would explain.
  check(parsed.cumulative.killed.total >= current.cumulative.killed.total * 0.98, 'killed total dropped >2% — refusing update')
  const next = {
    ...current,
    document: `Ukraine — Protection of Civilians in Armed Conflict: ${MONTHS[Number(report.reportMonth.slice(5)) - 1]} ${report.reportMonth.slice(0, 4)} update`,
    pageUrl: report.pageUrl,
    pdfUrl: report.pdfUrl,
    publishedAt: report.publishedAt,
    periodEnd: lastDay(report.reportMonth),
    retrievedAt: today,
    ...parsed,
  }
  console.log(
    `OHCHR ${report.reportMonth}: killed ${next.cumulative.killed.total} (women ${next.cumulative.killed.women}, girls ${next.cumulative.killed.girls}), injured ${next.cumulative.injured.total}; all checks passed.`,
  )
  if (!DRY) writeJson(file, next)
  return true
}

/* ------------------------------------------------------------------ */
/* Source 2: UNHCR API                                                 */
/* ------------------------------------------------------------------ */

async function updateDisplacement() {
  const file = 'unhcr-displacement.json'
  const current = readJson(file)
  const num = (v) => (typeof v === 'number' ? v : Number(v) || 0)
  const pop = JSON.parse(await fetchText(`${UNHCR_API}population/?coo=UKR&yearFrom=2021&yearTo=${new Date().getFullYear()}&limit=50`))
  const years = pop.items
    .map((i) => ({ year: num(i.year), refugees: num(i.refugees), idps: num(i.idps) }))
    .filter((y) => y.year >= 2021 && y.refugees > 0)
    .sort((a, b) => a.year - b.year)
  check(years.length, 'UNHCR: no data')
  const latestYear = years[years.length - 1].year
  const dem = JSON.parse(await fetchText(`${UNHCR_API}demographics/?coo=UKR&year=${latestYear}&ptype_show=true&limit=50`))
  const split = (type) => {
    const row = dem.items.find((i) => i.pop_type === type)
    check(row, `UNHCR: no ${type} demographics`)
    return { total: num(row.total), female: num(row.f_total), male: num(row.m_total) }
  }
  const latest = { year: latestYear, refugees: split('REF'), idps: split('IDP') }
  const last = years[years.length - 1]
  check(latest.refugees.total === last.refugees && latest.idps.total === last.idps, 'UNHCR: population and demographics disagree')
  for (const s of [latest.refugees, latest.idps]) check(s.female > 0 && s.female + s.male <= s.total, 'UNHCR: inconsistent sex split')
  if (JSON.stringify({ years, latest }) === JSON.stringify({ years: current.years, latest: current.latest })) {
    console.log(`UNHCR: unchanged (latest year ${latestYear}).`)
    return false
  }
  console.log(`UNHCR: new figures for ${latestYear}; all checks passed.`)
  if (!DRY) writeJson(file, { ...current, years, latest, retrievedAt: today })
  return true
}

/* ------------------------------------------------------------------ */

async function main() {
  let changed = false
  for (const [name, run] of [
    ['OHCHR', updateCasualties],
    ['UNHCR', updateDisplacement],
  ]) {
    if (opt('--pdf') && name !== 'OHCHR') continue
    try {
      changed = (await run()) || changed
    } catch (e) {
      warn(
        `${name}: ${e instanceof CheckError ? 'integrity check failed' : 'source unavailable'} — keeping the last verified data. ${e.message}`,
      )
    }
  }
  if (changed && !DRY) {
    const manifest = readJson('manifest.json')
    writeJson('manifest.json', { ...manifest, version: new Date().toISOString() })
    console.log('manifest.json bumped — open dashboards will reload the new data.')
  }
  if (process.env.GITHUB_OUTPUT) writeFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`, { flag: 'a' })
}

// Run only when executed directly (the parser can also be imported for testing).
if (import.meta.url === pathToFileURL(process.argv[1]).href) await main()
