/** Tipos do protótipo Ciência Delas. Todos os registros usados são DEMO DATA. */

export type RegionId =
  | 'volyn'
  | 'rivne'
  | 'zhytomyr'
  | 'kyiv-city'
  | 'chernihiv'
  | 'sumy'
  | 'lviv'
  | 'ternopil'
  | 'khmelnytskyi'
  | 'kyiv'
  | 'cherkasy'
  | 'poltava'
  | 'kharkiv'
  | 'zakarpattia'
  | 'ivano-frankivsk'
  | 'chernivtsi'
  | 'vinnytsia'
  | 'kirovohrad'
  | 'dnipropetrovsk'
  | 'donetsk'
  | 'luhansk'
  | 'odesa'
  | 'mykolaiv'
  | 'kherson'
  | 'zaporizhzhia'
  | 'crimea'

export interface Region {
  id: RegionId
  name: string
  /** Sigla exibida dentro do hexágono */
  short: string
  /** Posição no mapa de hexágonos */
  col: number
  row: number
}

export type ViolenceType = 'sexual' | 'physical' | 'psychological' | 'displacement' | 'detention' | 'other'

export type VictimGroup = 'adulta' | 'menina' | 'idosa'

export type RecordStatus = 'documentado' | 'em-verificacao'

export type SourceType = 'monitoramento' | 'humanitaria' | 'registro-publico' | 'pesquisa'

export interface DemoRecord {
  /** Identificador sintético — nunca ligado a um caso real */
  id: string
  /** Data ISO (AAAA-MM-DD) */
  date: string
  region: RegionId
  type: ViolenceType
  victimGroup: VictimGroup
  status: RecordStatus
  sourceType: SourceType
}
