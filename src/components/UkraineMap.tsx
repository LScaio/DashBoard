import { useMemo, useState } from 'react'
import type { Incident } from '../types'
import { countsByRegion, fmt } from '../utils/stats'
import { Card } from './Card'
import { HEX_R, MAP_HEIGHT, MAP_WIDTH, hexCenter, hexPoints } from './hexGeometry'

/** Single-hue lilac ramp: darker = fewer records in the demo dataset. */
const RAMP = ['#2a2547', '#40357a', '#6450b8', '#957cf0', '#c9b8ff']
const fillFor = (count: number, max: number) =>
  count ? RAMP[Math.min(RAMP.length - 1, Math.floor((count / max) * RAMP.length))] : '#191726'

export function UkraineMap({ records, className }: { records: Incident[]; className?: string }) {
  const stats = useMemo(() => countsByRegion(records), [records])
  const max = Math.max(...stats.map((s) => s.count))
  const [hovered, setHovered] = useState<string | null>(null)
  const active = stats.find((s) => s.region.id === hovered)

  return (
    <Card
      title="Distribuição geográfica"
      className={className}
      delay={0.25}
      aside={
        <div className="flex items-center gap-1.5 text-[10px] text-ink-3" aria-label="Legenda">
          menos
          <span className="flex">
            {RAMP.map((c) => (
              <span key={c} className="h-2 w-3.5 first:rounded-l last:rounded-r" style={{ background: c }} />
            ))}
          </span>
          mais
        </div>
      }
    >
      <div className="flex h-full flex-col">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="h-[200px] w-full fit:h-auto fit:min-h-0 fit:flex-1"
          role="group"
          aria-label="Mapa estilizado das regiões da Ucrânia"
        >
          {stats.map((s) => {
            const { x, y } = hexCenter(s.region.col, s.region.row)
            const isHover = hovered === s.region.id
            return (
              <g
                key={s.region.id}
                tabIndex={0}
                role="img"
                aria-label={`${s.region.name}: ${s.count} registros no conjunto demonstrativo`}
                className="cursor-default outline-none"
                onMouseEnter={() => setHovered(s.region.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(s.region.id)}
                onBlur={() => setHovered(null)}
                onClick={() => setHovered(s.region.id)}
              >
                <polygon
                  points={hexPoints(x, y, HEX_R - 2.5)}
                  fill={fillFor(s.count, max)}
                  stroke={isHover ? '#ffffff' : '#0b0a14'}
                  strokeWidth={isHover ? 2.5 : 1.5}
                  style={{ transition: 'stroke 120ms' }}
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={600}
                  fill={s.count / max > 0.6 ? '#1a1530' : s.count ? '#e4def8' : '#4a4563'}
                  className="pointer-events-none"
                >
                  {s.region.short}
                </text>
              </g>
            )
          })}
        </svg>
        <div
          className="mt-2 flex min-h-[34px] items-center justify-between gap-3 rounded-lg border border-line px-3 py-1.5 text-xs"
          aria-live="polite"
        >
          {active ? (
            <>
              <span className="font-medium text-ink">{active.region.name}</span>
              <span className="text-ink-2">
                <span className="tabular font-semibold text-ink">{fmt(active.count)}</span> registros no conjunto demonstrativo
              </span>
            </>
          ) : (
            <span className="text-ink-3">Passe o mouse sobre uma região</span>
          )}
        </div>
      </div>
    </Card>
  )
}
