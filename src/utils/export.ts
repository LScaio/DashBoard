import {
  AGE_GROUP_LABEL,
  CIVILIAN_STATUS_LABEL,
  CONTEXT_LABEL,
  SOURCE_TYPE_LABEL,
  STATUS_LABEL,
  VERIFICATION_LABEL,
  VIOLENCE_TYPE_LABEL,
} from '../data/labels'
import { REGION_BY_ID } from '../data/regions'
import type { Incident } from '../types'

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

export function incidentsToCSV(records: Incident[]): string {
  const header = [
    'incident_id',
    'date',
    'region',
    'type',
    'age_group',
    'civilian_status',
    'context',
    'source_type',
    'verification',
    'status',
    'data_label',
  ]
  const rows = records.map((r) => [
    r.id,
    r.date,
    REGION_BY_ID[r.region].name,
    VIOLENCE_TYPE_LABEL[r.type],
    AGE_GROUP_LABEL[r.ageGroup],
    CIVILIAN_STATUS_LABEL[r.civilianStatus],
    CONTEXT_LABEL[r.context],
    SOURCE_TYPE_LABEL[r.sourceType],
    VERIFICATION_LABEL[r.verification],
    STATUS_LABEL[r.status],
    'DEMO DATA - NOT OFFICIAL STATISTICS',
  ])
  const notice = '# DEMONSTRATION DATA - synthetic records generated for a prototype. Not official statistics. Do not cite.'
  return [notice, header.join(','), ...rows.map((r) => r.map(csvCell).join(','))].join('\n')
}

export function downloadFile(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
