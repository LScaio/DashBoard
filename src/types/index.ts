/** Domain types for the Ciência Delas dashboard. Every value comes from public/data/dados.csv. */

/** Values of the "Status do dado" column. */
export type DataStatus = 'Documentado' | 'Estimativa' | 'Não disponível'

/** The "Valor" column, parsed. Text such as "Não informado" is kept as-is. */
export type ParsedValue =
  { kind: 'number'; value: number } | { kind: 'range'; min: number; max: number } | { kind: 'missing'; text: string }

export interface DataRow {
  /** Row number in the spreadsheet (header = 1), shown for traceability */
  line: number
  categoria: string
  /** Verbatim "Período", e.g. "14/04/2014–31/12/2021", "2025" */
  periodo: string
  indicador: string
  valorBruto: string
  unidade: string
  status: DataStatus
  metodo: string
  fonte: string
  url: string
  observacoes: string
  value: ParsedValue
  /** Period bounds as ISO dates, when the period could be parsed */
  start: string | null
  end: string | null
}

export interface Dataset {
  rows: DataRow[]
  /** "Metadados" sheet: Campo → Valor */
  meta: Map<string, string>
}
