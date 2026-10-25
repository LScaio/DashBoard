/**
 * ============================================================================
 *  SINGLE SOURCE OF TRUTH
 * ============================================================================
 *  Every number on the dashboard is read from two CSV files exported from the
 *  project spreadsheet:
 *
 *    public/data/dados.csv       aba "Dados"      (one indicator per row)
 *    public/data/metadados.csv   aba "Metadados"  (preparation date, rules)
 *
 *  Nothing here invents, rounds away or combines values beyond the derived
 *  checks below, each of which names the spreadsheet rows it uses. To update
 *  the dashboard, replace those files — the open page picks them up on its
 *  next check (see useDataSource).
 * ============================================================================
 */
import type { DataRow, DataStatus, Dataset, ParsedValue } from '../types'

const BASE = import.meta.env.BASE_URL
export const DATA_URL = `${BASE}data/dados.csv`
export const META_URL = `${BASE}data/metadados.csv`

const STATUSES: DataStatus[] = ['Documentado', 'Estimativa', 'Não disponível']

const COLUMNS = {
  categoria: 'Categoria',
  periodo: 'Período',
  indicador: 'Indicador',
  valorBruto: 'Valor',
  unidade: 'Unidade',
  status: 'Status do dado',
  metodo: 'Método',
  fonte: 'Fonte',
  url: 'URL da fonte',
  observacoes: 'Observações metodológicas',
} as const

/** RFC 4180 CSV: quoted fields, doubled quotes, CRLF or LF, optional BOM. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  const src = text.replace(/^﻿/, '')
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (quoted) {
      if (c !== '"') field += c
      else if (src[i + 1] === '"') {
        field += '"'
        i++
      } else quoted = false
    } else if (c === '"') quoted = true
    else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else field += c
  }
  if (field || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => r.some((f) => f.trim() !== ''))
}

/** "3107" → 3107; also accepts pt-BR "3.107" and "19,7". */
function toNumber(s: string): number {
  return Number(s.replace(/\./g, '').replace(',', '.'))
}

export function parseValue(raw: string): ParsedValue {
  const t = raw.trim()
  const range = t.match(/^(\d[\d.]*)\s*[-–]\s*(\d[\d.]*)$/)
  if (range) return { kind: 'range', min: toNumber(range[1]), max: toNumber(range[2]) }
  if (/^\d[\d.]*(,\d+)?$/.test(t)) return { kind: 'number', value: toNumber(t) }
  return { kind: 'missing', text: t || 'Não informado' }
}

const iso = (d: string, m: string, y: string) => `${y}-${m}-${d}`

/** "14/04/2014–31/12/2021", "2022" or "2022–2023" → ISO bounds. */
export function parsePeriod(periodo: string): { start: string | null; end: string | null } {
  const p = periodo.trim()
  let m = p.match(/^(\d{2})\/(\d{2})\/(\d{4})\s*[–-]\s*(\d{2})\/(\d{2})\/(\d{4})$/)
  if (m) return { start: iso(m[1], m[2], m[3]), end: iso(m[4], m[5], m[6]) }
  m = p.match(/^(\d{4})$/)
  if (m) return { start: `${m[1]}-01-01`, end: `${m[1]}-12-31` }
  m = p.match(/^(\d{4})\s*[–-]\s*(\d{4})$/)
  if (m) return { start: `${m[1]}-01-01`, end: `${m[2]}-12-31` }
  return { start: null, end: null }
}

export function parseDataset(dadosCsv: string, metaCsv: string): Dataset {
  const [header, ...body] = parseCsv(dadosCsv)
  if (!header) throw new Error('dados.csv está vazio')
  const col = Object.fromEntries(
    Object.entries(COLUMNS).map(([key, name]) => {
      const i = header.findIndex((h) => h.trim() === name)
      if (i < 0) throw new Error(`Coluna "${name}" não encontrada em dados.csv`)
      return [key, i]
    }),
  ) as Record<keyof typeof COLUMNS, number>

  const rows = body.map((cells, i): DataRow => {
    const get = (k: keyof typeof COLUMNS) => (cells[col[k]] ?? '').trim()
    const line = i + 2
    const status = get('status') as DataStatus
    if (!STATUSES.includes(status)) throw new Error(`Status do dado desconhecido na linha ${line}: "${status}"`)
    return {
      line,
      categoria: get('categoria'),
      periodo: get('periodo'),
      indicador: get('indicador'),
      valorBruto: get('valorBruto'),
      unidade: get('unidade'),
      status,
      metodo: get('metodo'),
      fonte: get('fonte'),
      url: get('url'),
      observacoes: get('observacoes'),
      value: parseValue(get('valorBruto')),
      ...parsePeriod(get('periodo')),
    }
  })

  const meta = new Map(
    parseCsv(metaCsv)
      .slice(1)
      .map(([k, v]) => [k.trim(), (v ?? '').trim()] as [string, string]),
  )
  return { rows, meta }
}

// ---------------------------------------------------------------------------
//  Selectors
// ---------------------------------------------------------------------------

export function findRow(rows: DataRow[], indicador: string, periodo?: string): DataRow | undefined {
  return rows.find((r) => r.indicador === indicador && (periodo === undefined || r.periodo === periodo))
}

/** The row of an indicator with the most recent end date. */
export function latestRow(rows: DataRow[], indicador: string): DataRow | undefined {
  return rows.filter((r) => r.indicador === indicador).sort((a, b) => (b.end ?? '').localeCompare(a.end ?? ''))[0]
}

/** Point value of a row, or null for ranges and missing values. */
export const numberOf = (r: DataRow | undefined): number | null => (r?.value.kind === 'number' ? r.value.value : null)

/** Earliest start and latest end across all rows. */
export function coverage(rows: DataRow[]): { start: string | null; end: string | null } {
  const starts = rows.map((r) => r.start).filter((d): d is string => !!d)
  const ends = rows.map((r) => r.end).filter((d): d is string => !!d)
  return { start: starts.sort()[0] ?? null, end: ends.sort().at(-1) ?? null }
}

/** True when the period does not cover whole calendar years (e.g. jan–jul 2026). */
export function isPartialYear(r: DataRow): boolean {
  return !!r.start && !!r.end && (!r.start.endsWith('-01-01') || !r.end.endsWith('-12-31'))
}

/** "Proporção de 19,7% aplicada…" → 19.7 */
export function proportionFromMethod(metodo: string): number | null {
  const m = metodo.match(/(\d+(?:,\d+)?)\s*%/)
  return m ? toNumber(m[1]) : null
}

/**
 * Group total quoted in the observations column, e.g. "Parte das 5.385 mortes…",
 * "entre cerca de 4.000 pessoas…", "em um total aproximado de 340 vítimas".
 */
export function totalFromNote(note: string): number | null {
  const m = note.match(/(?:Parte d[aoe]s|entre cerca de|total aproximado de)\s+(\d{1,3}(?:\.\d{3})+|\d+)/i)
  return m ? toNumber(m[1]) : null
}

/** All integers written in a note ("Inclui 1.072 mulheres, 1.853 homens…"). */
function numbersInNote(note: string): number[] {
  return [...note.matchAll(/\d{1,3}(?:\.\d{3})+|\d+/g)].map((m) => toNumber(m[0]))
}

// ---------------------------------------------------------------------------
//  Annual estimates (historical chart)
// ---------------------------------------------------------------------------

export const ANNUAL_INDICATOR = 'Vítimas civis - mulheres'
export const CUMULATIVE_INDICATOR = 'Vítimas civis acumuladas - mulheres'

export interface AnnualPoint {
  row: DataRow
  year: string
  value: number
  partial: boolean
  proportion: number | null
}

export function annualEstimates(rows: DataRow[]): AnnualPoint[] {
  return rows
    .filter((r) => r.indicador === ANNUAL_INDICATOR && r.status === 'Estimativa' && r.value.kind === 'number' && r.start)
    .sort((a, b) => a.start!.localeCompare(b.start!))
    .map((row) => ({
      row,
      year: row.start!.slice(0, 4),
      value: numberOf(row)!,
      partial: isPartialYear(row),
      proportion: proportionFromMethod(row.metodo),
    }))
}

// ---------------------------------------------------------------------------
//  Consistency checks, shown on the dashboard
// ---------------------------------------------------------------------------

export interface Check {
  ok: boolean
  label: string
  detail: string
  lines: number[]
}

const nf = new Intl.NumberFormat('pt-BR')
/** A row's value for check details: formatted when numeric, verbatim otherwise. */
const shown = (r: DataRow) => {
  const n = numberOf(r)
  return n === null ? r.valorBruto : nf.format(n)
}

export function consistencyChecks(rows: DataRow[]): Check[] {
  const checks: Check[] = []

  // 1. Annual estimates must add up to the cumulative estimate shown on the KPI card.
  const annual = annualEstimates(rows)
  const cumulative = latestRow(rows, CUMULATIVE_INDICATOR)
  if (annual.length && cumulative) {
    const sum = annual.reduce((s, p) => s + p.value, 0)
    checks.push({
      ok: sum === numberOf(cumulative),
      label: 'Estimativas anuais = estimativa acumulada',
      detail: `${annual.map((p) => nf.format(p.value)).join(' + ')} = ${nf.format(sum)} · planilha: ${shown(cumulative)}`,
      lines: [...annual.map((p) => p.row.line), cumulative.line],
    })
  }

  // 2. 2014–2021 deaths: the sex/age breakdown in the note must add up to the total.
  const total = rows.find((r) => r.indicador === 'Civis mortos - total')
  if (total && /^Inclui/i.test(total.observacoes)) {
    const parts = numbersInNote(total.observacoes)
    const sum = parts.reduce((s, n) => s + n, 0)
    const women = findRow(rows, 'Civis mortas - mulheres', total.periodo)
    checks.push({
      ok: sum === numberOf(total) && (!women || parts[0] === numberOf(women)),
      label: `Desagregação dos civis mortos (${total.periodo})`,
      detail: `${parts.map((n) => nf.format(n)).join(' + ')} = ${nf.format(sum)} · planilha: ${shown(total)}`,
      lines: [total.line, ...(women ? [women.line] : [])],
    })
  }

  // 3. CRSV: attributions in the note must add up to the women total, and match the Russian-attribution row.
  const crsv = latestRow(rows, 'Vítimas de CRSV - mulheres')
  if (crsv) {
    const parts = numbersInNote(crsv.observacoes)
    const sum = parts.reduce((s, n) => s + n, 0)
    const ru = findRow(rows, 'Vítimas de CRSV atribuídas a autoridades russas - mulheres', crsv.periodo)
    checks.push({
      ok: parts.length > 1 && sum === numberOf(crsv) && (!ru || parts[0] === numberOf(ru)),
      label: 'Violência sexual (CRSV): atribuições somam o total',
      detail: `${parts.map((n) => nf.format(n)).join(' + ')} = ${nf.format(sum)} · planilha: ${shown(crsv)}`,
      lines: [crsv.line, ...(ru ? [ru.line] : [])],
    })
  }

  return checks
}
