/**
 * ============================================================================
 *  DEMO DATA — DADOS ILUSTRATIVOS, NÃO REPRESENTAM ESTATÍSTICAS OFICIAIS
 * ============================================================================
 *  Registros fictícios criados apenas para que os gráficos e o mapa deste
 *  protótipo funcionem. Não descrevem eventos nem pessoas reais e não devem
 *  ser citados. Não contêm nomes, endereços ou qualquer dado pessoal.
 * ============================================================================
 */
import type { DemoRecord, RecordStatus, RegionId, SourceType, VictimGroup, ViolenceType } from '../types'

export const CONFLICT_START = '2022-02-24'

type Row = [date: string, region: RegionId, type: ViolenceType, group: VictimGroup, status: RecordStatus, source: SourceType]

// prettier-ignore
const ROWS: Row[] = [
  ['2022-03-04', 'kyiv',           'physical',      'adulta', 'documentado',    'monitoramento'],
  ['2022-03-12', 'chernihiv',      'detention',     'adulta', 'documentado',    'monitoramento'],
  ['2022-03-19', 'kharkiv',        'displacement',  'menina', 'documentado',    'humanitaria'],
  ['2022-03-27', 'kyiv',           'sexual',        'adulta', 'documentado',    'monitoramento'],
  ['2022-04-08', 'sumy',           'psychological', 'idosa',  'documentado',    'humanitaria'],
  ['2022-05-15', 'donetsk',        'displacement',  'adulta', 'documentado',    'registro-publico'],
  ['2022-06-22', 'luhansk',        'physical',      'adulta', 'documentado',    'monitoramento'],
  ['2022-08-09', 'kherson',        'sexual',        'adulta', 'documentado',    'monitoramento'],
  ['2022-10-03', 'zaporizhzhia',   'detention',     'adulta', 'documentado',    'humanitaria'],
  ['2022-11-21', 'lviv',           'displacement',  'menina', 'documentado',    'humanitaria'],
  ['2023-01-17', 'kherson',        'psychological', 'adulta', 'documentado',    'pesquisa'],
  ['2023-02-28', 'donetsk',        'physical',      'idosa',  'documentado',    'monitoramento'],
  ['2023-04-11', 'mykolaiv',       'displacement',  'adulta', 'documentado',    'humanitaria'],
  ['2023-05-30', 'kharkiv',        'sexual',        'adulta', 'documentado',    'monitoramento'],
  ['2023-07-06', 'zaporizhzhia',   'other',         'adulta', 'documentado',    'registro-publico'],
  ['2023-08-24', 'crimea',         'detention',     'adulta', 'em-verificacao', 'monitoramento'],
  ['2023-10-12', 'odesa',          'psychological', 'menina', 'documentado',    'pesquisa'],
  ['2023-12-05', 'dnipropetrovsk', 'physical',      'adulta', 'documentado',    'registro-publico'],
  ['2024-01-23', 'donetsk',        'sexual',        'adulta', 'documentado',    'monitoramento'],
  ['2024-03-12', 'kharkiv',        'sexual',        'adulta', 'documentado',    'monitoramento'],
  ['2024-04-29', 'kyiv-city',      'psychological', 'adulta', 'documentado',    'pesquisa'],
  ['2024-06-14', 'zaporizhzhia',   'displacement',  'idosa',  'documentado',    'humanitaria'],
  ['2024-08-02', 'luhansk',        'detention',     'adulta', 'em-verificacao', 'monitoramento'],
  ['2024-09-18', 'zakarpattia',    'displacement',  'menina', 'documentado',    'humanitaria'],
  ['2024-11-27', 'kherson',        'physical',      'adulta', 'documentado',    'registro-publico'],
  ['2025-01-14', 'sumy',           'physical',      'idosa',  'documentado',    'registro-publico'],
  ['2025-03-03', 'donetsk',        'psychological', 'adulta', 'documentado',    'pesquisa'],
  ['2025-04-21', 'kharkiv',        'other',         'adulta', 'documentado',    'humanitaria'],
  ['2025-06-09', 'poltava',        'displacement',  'adulta', 'documentado',    'humanitaria'],
  ['2025-08-16', 'zaporizhzhia',   'sexual',        'adulta', 'em-verificacao', 'monitoramento'],
  ['2025-10-07', 'kherson',        'detention',     'adulta', 'em-verificacao', 'monitoramento'],
  ['2025-12-01', 'vinnytsia',      'psychological', 'menina', 'documentado',    'pesquisa'],
  ['2026-02-10', 'donetsk',        'physical',      'adulta', 'em-verificacao', 'registro-publico'],
  ['2026-04-22', 'dnipropetrovsk', 'displacement',  'idosa',  'documentado',    'humanitaria'],
  ['2026-06-30', 'kharkiv',        'psychological', 'adulta', 'em-verificacao', 'pesquisa'],
  ['2026-08-19', 'odesa',          'other',         'menina', 'em-verificacao', 'humanitaria'],
]

/** DEMO DATA — 36 registros fictícios. */
export const DEMO_DATA: DemoRecord[] = ROWS.map(([date, region, type, victimGroup, status, sourceType], i) => ({
  id: `DEMO-${String(i + 1).padStart(3, '0')}`,
  date,
  region,
  type,
  victimGroup,
  status,
  sourceType,
}))
