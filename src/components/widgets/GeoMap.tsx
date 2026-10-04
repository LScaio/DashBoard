import { useMemo, useState } from 'react'
import { useDashboard } from '../../state/dashboardStore'
import type { RegionId } from '../../types'
import { cn, fmt } from '../../utils/format'
import { matchesDimensions, rangeOf, regionStats, type RegionStat } from '../../utils/metrics'
import { HEX_R, MAP_HEIGHT, MAP_WIDTH, hexCenter, hexPoints } from '../map/hexGeometry'
import { Card } from '../ui/Card'
import { DemoTag } from '../ui/DemoTag'
import { ChartTooltip } from './chartParts'

/** Sequential single-hue ramp: darker = fewer documented incidents. */
const RAMP = ['#1f2a48', '#2f3d7a', '#4a56c2', '#7c83fd', '#b3b8ff']

function fillFor(count: number, max: number): string {
  if (!count) return '#141a26'
  return RAMP[Math.min(RAMP.length - 1, Math.floor((count / max) * RAMP.length))]
}

function periodLabel(s: RegionStat) {
  if (!s.firstYear) return '—'
  return s.firstYear === s.lastYear ? String(s.firstYear) : `${s.firstYear}–${s.lastYear}`
}

export function GeoMap({ className }: { className?: string }) {
  const { allRecords, filters, patchFilters } = useDashboard()
  const [hovered, setHovered] = useState<RegionId | null>(null)
  // Every filter except region, so the selected region stays in context.
  const stats = useMemo(() => {
    const { from, to } = rangeOf(filters)
    const f = { ...filters, region: 'all' as const }
    return regionStats(allRecords.filter((r) => r.date >= from && r.date <= to && matchesDimensions(r, f)))
  }, [allRecords, filters])
  const max = Math.max(1, ...stats.map((s) => s.count))
  const hoveredStat = stats.find((s) => s.region.id === hovered)

  return (
    <Card
      title="Geographic distribution"
      subtitle="Documented incidents in dataset · click a region to filter"
      className={className}
      actions={<DemoTag />}
    >
      <div className="relative">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="h-auto w-full"
          role="group"
          aria-label="Stylised map of Ukraine's regions"
        >
          {stats.map((s) => {
            const { x, y } = hexCenter(s.region.col, s.region.row)
            const isHover = hovered === s.region.id
            const selected = filters.region === s.region.id
            const dim = filters.region !== 'all' && !selected
            const light = s.count / max > 0.6
            return (
              <g
                key={s.region.id}
                role="button"
                tabIndex={0}
                aria-label={`${s.region.name}: ${s.count} documented incidents in dataset`}
                aria-pressed={selected}
                className="cursor-pointer outline-none"
                style={{ opacity: dim ? 0.35 : 1, transition: 'opacity 200ms' }}
                onMouseEnter={() => setHovered(s.region.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(s.region.id)}
                onBlur={() => setHovered(null)}
                onClick={() => patchFilters({ region: selected ? 'all' : s.region.id })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    patchFilters({ region: selected ? 'all' : s.region.id })
                  }
                }}
              >
                <polygon
                  points={hexPoints(x, y, HEX_R - 2.5)}
                  fill={fillFor(s.count, max)}
                  stroke={selected || isHover ? '#ffffff' : '#202938'}
                  strokeWidth={selected || isHover ? 2 : 1}
                  style={{ transition: 'fill 300ms' }}
                />
                <text
                  x={x}
                  y={y - 2}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight={600}
                  fill={light ? '#0b0f17' : s.count ? '#e6e9f0' : '#4b5567'}
                  className="pointer-events-none"
                >
                  {s.region.short}
                </text>
                <text
                  x={x}
                  y={y + 11}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill={light ? '#1f2a48' : '#a3acbd'}
                  className="tabular pointer-events-none"
                >
                  {s.count ? fmt(s.count) : '–'}
                </text>
              </g>
            )
          })}
        </svg>

        {hoveredStat && (
          <div
            className="pointer-events-none absolute z-10"
            style={(() => {
              const { x, y } = hexCenter(hoveredStat.region.col, hoveredStat.region.row)
              const left = (x / MAP_WIDTH) * 100
              return {
                left: `${left}%`,
                top: `${(y / MAP_HEIGHT) * 100}%`,
                transform: `translate(${left > 50 ? 'calc(-100% - 30px)' : '30px'}, -50%)`,
              }
            })()}
          >
            <ChartTooltip
              rows={[
                ['Region', hoveredStat.region.name],
                ['Documented incidents', fmt(hoveredStat.count)],
                ['Reporting period', periodLabel(hoveredStat)],
                ['Confidence', hoveredStat.count ? hoveredStat.confidence.toUpperCase() : '—'],
              ]}
            />
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[10.5px] text-ink-3" aria-label="Legend">
          <span>Fewer</span>
          <div className="flex">
            {RAMP.map((c) => (
              <span key={c} className="h-2.5 w-6 first:rounded-l last:rounded-r" style={{ background: c }} />
            ))}
          </div>
          <span>More</span>
          <span className={cn('ml-2 inline-flex items-center gap-1')}>
            <span className="h-2.5 w-2.5 rounded-sm border border-line" style={{ background: '#141a26' }} /> None
          </span>
        </div>
        <span className="text-[10.5px] text-ink-3">Schematic map · not to scale</span>
      </div>
    </Card>
  )
}
