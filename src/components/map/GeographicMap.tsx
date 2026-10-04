import { AnimatePresence, motion } from 'framer-motion'
import { Map as MapIcon, MousePointerClick } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDashboard } from '../../context/dashboardStore'
import type { ConfidenceLevel, RegionId, RegionStat } from '../../types'
import { filterIncidents, intensityOf, regionStats, type Intensity } from '../../utils/analytics'
import { formatDate } from '../../utils/date'
import { cn, formatNumber } from '../../utils/format'
import { TooltipCard } from '../charts/ChartTooltip'
import { Badge, type Tone } from '../ui/Badge'
import { DataLabel } from '../ui/DataLabel'
import { InfoTip } from '../ui/InfoTip'
import { Panel } from '../ui/Panel'
import { HEX_R, MAP_HEIGHT, MAP_WIDTH, hexCenter, hexPoints } from './hexGeometry'

/** Sequential single-hue ramp (blue), dark → light = low → high on the dark surface. */
const INTENSITY_FILL: Record<Intensity, string> = {
  none: 'rgba(148,163,184,0.05)',
  low: '#1d3b6e',
  medium: '#2a6ad0',
  high: '#6aa8f5',
}
const INTENSITY_TEXT: Record<Intensity, string> = {
  none: '#64748b',
  low: '#bcd3f5',
  medium: '#eaf2ff',
  high: '#06122a',
}

const CONFIDENCE_TONE: Record<ConfidenceLevel, Tone> = { High: 'ok', Moderate: 'accent', Low: 'warn' }

function RegionTooltip({ stat }: { stat: RegionStat }) {
  return (
    <TooltipCard
      title={stat.region.name}
      rows={[
        { label: 'Reported incidents in dataset', value: formatNumber(stat.count) },
        {
          label: 'Reporting period',
          value: stat.firstDate && stat.lastDate ? `${formatDate(stat.firstDate)} – ${formatDate(stat.lastDate)}` : '—',
        },
        { label: 'Data confidence', value: stat.count ? stat.confidence : '—' },
      ]}
      footer="Demo data · not comparable without context"
    />
  )
}

export function GeographicMap() {
  const { allRecords, filters, patchFilters } = useDashboard()
  const [hovered, setHovered] = useState<RegionId | null>(null)
  // The map applies every filter except region, so a selected region stays in context.
  const stats = useMemo(() => regionStats(filterIncidents(allRecords, { ...filters, region: 'all' })), [allRecords, filters])
  const max = Math.max(0, ...stats.map((s) => s.count))
  const ranked = [...stats].filter((s) => s.count > 0).sort((a, b) => b.count - a.count)
  const hoveredStat = stats.find((s) => s.region.id === hovered)

  const toggleRegion = (id: RegionId) => patchFilters({ region: filters.region === id ? 'all' : id })

  return (
    <Panel
      title="Geographic distribution"
      subtitle="Reported incidents in dataset, by region"
      icon={<MapIcon className="h-4 w-4" />}
      labels={
        <>
          <DataLabel kind="demo" />
          <DataLabel kind="limitations" />
        </>
      }
      bodyClassName="p-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative border-b border-white/[0.06] p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div
            className="pointer-events-none absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
            aria-hidden
          />
          <div className="relative">
            <svg
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              className="h-auto w-full"
              role="group"
              aria-label="Schematic tile map of Ukraine’s regions. Select a region to filter the dashboard."
            >
              <text x={MAP_WIDTH * 0.24} y={MAP_HEIGHT - 26} className="fill-slate-600 font-mono" fontSize="10" letterSpacing="3">
                BLACK SEA
              </text>
              <text
                x={MAP_WIDTH - 40}
                y={MAP_HEIGHT - 52}
                className="fill-slate-600 font-mono"
                fontSize="9"
                letterSpacing="2"
                textAnchor="middle"
              >
                SEA OF AZOV
              </text>
              {stats.map((s, i) => {
                const { x, y } = hexCenter(s.region.col, s.region.row)
                const intensity = intensityOf(s.count, max)
                const isHovered = hovered === s.region.id
                const isSelected = filters.region === s.region.id
                const dimmed = filters.region !== 'all' && !isSelected
                return (
                  <motion.g
                    key={s.region.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${s.region.name}: ${s.count} reported incidents in dataset, data confidence ${s.confidence}`}
                    aria-pressed={isSelected}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: dimmed ? 0.35 : 1, scale: isHovered ? 1.06 : 1 }}
                    transition={{ opacity: { delay: 0.02 * i, duration: 0.4 }, scale: { type: 'spring', stiffness: 400, damping: 25 } }}
                    style={{ transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' }}
                    className="cursor-pointer outline-none"
                    onMouseEnter={() => setHovered(s.region.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(s.region.id)}
                    onBlur={() => setHovered(null)}
                    onClick={() => toggleRegion(s.region.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggleRegion(s.region.id)
                      }
                    }}
                  >
                    <polygon
                      points={hexPoints(x, y, HEX_R - 2.5)}
                      fill={INTENSITY_FILL[intensity]}
                      stroke={isSelected ? '#93c5fd' : isHovered ? 'rgba(255,255,255,0.6)' : 'rgba(148,163,184,0.18)'}
                      strokeWidth={isSelected || isHovered ? 2 : 1}
                      style={{ transition: 'fill 400ms ease, stroke 150ms ease' }}
                    />
                    <text
                      x={x}
                      y={y - 3}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight={600}
                      fill={INTENSITY_TEXT[intensity]}
                      className="pointer-events-none font-mono"
                      letterSpacing="0.5"
                    >
                      {s.region.short}
                    </text>
                    <text
                      x={x}
                      y={y + 11}
                      textAnchor="middle"
                      fontSize="10"
                      fill={INTENSITY_TEXT[intensity]}
                      opacity={0.85}
                      className="pointer-events-none tabular"
                    >
                      {s.count || '–'}
                    </text>
                  </motion.g>
                )
              })}
            </svg>

            <AnimatePresence>
              {hoveredStat && (
                <motion.div
                  key={hoveredStat.region.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="pointer-events-none absolute z-10 hidden sm:block"
                  style={(() => {
                    const { x, y } = hexCenter(hoveredStat.region.col, hoveredStat.region.row)
                    const left = (x / MAP_WIDTH) * 100
                    const top = (y / MAP_HEIGHT) * 100
                    return {
                      left: `${left}%`,
                      top: `${top}%`,
                      transform: `translate(${left > 60 ? 'calc(-100% - 40px)' : '40px'}, -50%)`,
                    }
                  })()}
                >
                  <RegionTooltip stat={hoveredStat} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile: show hovered/selected details below the map */}
          {hoveredStat && (
            <div className="mt-3 sm:hidden">
              <RegionTooltip stat={hoveredStat} />
            </div>
          )}

          <div className="relative mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2" aria-label="Map legend">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Reported incidents</span>
              {(['low', 'medium', 'high'] as const).map((k) => (
                <span
                  key={k}
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-slate-300"
                >
                  <span className="h-3 w-4 rounded-sm" style={{ background: INTENSITY_FILL[k] }} aria-hidden />
                  {k}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">
                <span className="h-3 w-4 rounded-sm border border-white/10" style={{ background: INTENSITY_FILL.none }} aria-hidden />
                None
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
              <MousePointerClick className="h-3.5 w-3.5" aria-hidden /> Click a region to filter
            </span>
          </div>
          <p className="relative mt-2 font-mono text-[10px] text-slate-600">
            Schematic tile map — not to scale; positions approximate. Intensity is relative to the highest regional count in the current
            view.
          </p>
        </div>

        <div className="flex flex-col p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-[13px] font-semibold text-slate-200">Regions by records in dataset</h4>
            <InfoTip content="Ranking reflects documented records only. Differences in population, access to affected areas and documentation capacity mean absolute counts should not be read as relative danger." />
          </div>
          <ol className="scrollbar-thin mt-3 max-h-[340px] flex-1 space-y-1 overflow-y-auto pr-1">
            {ranked.slice(0, 12).map((s, i) => (
              <li key={s.region.id}>
                <button
                  type="button"
                  onClick={() => toggleRegion(s.region.id)}
                  onMouseEnter={() => setHovered(s.region.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    'w-full rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/[0.04]',
                    filters.region === s.region.id && 'bg-blue-500/10 ring-1 ring-blue-400/30',
                  )}
                >
                  <div className="flex items-center gap-2 text-[12.5px]">
                    <span className="tabular w-5 font-mono text-[10.5px] text-slate-500">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1 truncate text-slate-200">{s.region.name}</span>
                    <Badge tone={CONFIDENCE_TONE[s.confidence]} className="!px-1.5 !py-0 !text-[10px]">
                      {s.confidence}
                    </Badge>
                    <span className="tabular w-8 text-right font-medium text-slate-100">{s.count}</span>
                  </div>
                  <div className="ml-7 mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                    <motion.div
                      className="h-full rounded-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.count / max) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.03 * i, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </button>
              </li>
            ))}
            {!ranked.length && <li className="py-8 text-center text-sm text-slate-500">No records match the current filters.</li>}
          </ol>
          <p className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-[11.5px] leading-relaxed text-slate-400">
            Higher counts do not necessarily indicate higher risk. Population, access to occupied or front-line areas, and documentation
            capacity vary widely between regions.
          </p>
        </div>
      </div>
    </Panel>
  )
}
