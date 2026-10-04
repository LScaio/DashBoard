import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { DEMO_DATA } from '../../data/demoData'
import type { RegionId } from '../../types'
import { formatMonthYear } from '../../utils/date'
import { statsByRegion, type RegionStat } from '../../utils/stats'
import { HEX_R, MAP_HEIGHT, MAP_WIDTH, hexCenter, hexPoints } from './hexGeometry'

/** Rampa sequencial lilás: mais escuro = menos registros, mais claro = mais registros. */
function fillFor(count: number, max: number): string {
  if (!count) return 'rgba(237,233,254,0.04)'
  const r = count / max
  if (r > 0.66) return '#c4b5fd'
  if (r > 0.33) return '#8b6cf0'
  return '#4c3a9a'
}
const textFor = (count: number, max: number) => (!count ? 'rgba(237,233,254,0.35)' : count / max > 0.66 ? '#1c1537' : '#f5f3ff')

function MapTooltip({ stat }: { stat: RegionStat }) {
  return (
    <div className="w-60 rounded-2xl border border-white/10 bg-night-800/95 p-4 shadow-2xl shadow-black/40 backdrop-blur">
      <p className="font-display text-lg text-white">{stat.region.name}</p>
      <dl className="mt-2 space-y-1 text-[13px]">
        <div className="flex justify-between gap-4">
          <dt className="text-lilac-100/50">Registros demonstrativos</dt>
          <dd className="tabular font-medium text-white">{stat.count}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-lilac-100/50">Período</dt>
          <dd className="text-right text-white">
            {stat.first && stat.last
              ? stat.first === stat.last
                ? formatMonthYear(stat.first)
                : `${formatMonthYear(stat.first)} – ${formatMonthYear(stat.last)}`
              : '—'}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-lilac-300/70">Conjunto demonstrativo</p>
    </div>
  )
}

export function UkraineHexMap() {
  const stats = useMemo(() => statsByRegion(DEMO_DATA), [])
  const max = Math.max(...stats.map((s) => s.count))
  const [hovered, setHovered] = useState<RegionId | null>(null)
  const hoveredStat = stats.find((s) => s.region.id === hovered)

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="h-auto w-full"
        role="group"
        aria-label="Mapa estilizado das regiões da Ucrânia com registros do conjunto demonstrativo"
      >
        {stats.map((s, i) => {
          const { x, y } = hexCenter(s.region.col, s.region.row)
          const isHovered = hovered === s.region.id
          return (
            <motion.g
              key={s.region.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.03 * i, duration: 0.5 }}
            >
              <motion.g
                tabIndex={0}
                role="img"
                aria-label={`${s.region.name}: ${s.count} registros demonstrativos`}
                animate={{ scale: isHovered ? 1.08 : 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                style={{ transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' }}
                className="cursor-pointer outline-none"
                onMouseEnter={() => setHovered(s.region.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(s.region.id)}
                onBlur={() => setHovered(null)}
                onClick={() => setHovered(s.region.id)}
              >
                <polygon
                  points={hexPoints(x, y, HEX_R - 3)}
                  fill={fillFor(s.count, max)}
                  stroke={isHovered ? '#ffffff' : 'rgba(237,233,254,0.12)'}
                  strokeWidth={isHovered ? 2 : 1}
                  style={{ transition: 'stroke 150ms' }}
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={500}
                  fill={textFor(s.count, max)}
                  className="pointer-events-none"
                  letterSpacing="0.5"
                >
                  {s.region.short}
                </text>
              </motion.g>
            </motion.g>
          )
        })}
        <text x={MAP_WIDTH * 0.24} y={MAP_HEIGHT - 26} fill="rgba(237,233,254,0.25)" fontSize="10" letterSpacing="4">
          MAR NEGRO
        </text>
      </svg>

      {hoveredStat &&
        (() => {
          const { x, y } = hexCenter(hoveredStat.region.col, hoveredStat.region.row)
          const left = (x / MAP_WIDTH) * 100
          return (
            <div
              className="pointer-events-none absolute z-10 hidden sm:block"
              style={{
                left: `${left}%`,
                top: `${(y / MAP_HEIGHT) * 100}%`,
                transform: `translate(${left > 50 ? 'calc(-100% - 36px)' : '36px'}, -50%)`,
              }}
            >
              <AnimatePresence>
                <motion.div
                  key={hoveredStat.region.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <MapTooltip stat={hoveredStat} />
                </motion.div>
              </AnimatePresence>
            </div>
          )
        })()}

      {/* No celular, o detalhe aparece abaixo do mapa */}
      <div className="mt-4 sm:hidden">
        {hoveredStat ? (
          <MapTooltip stat={hoveredStat} />
        ) : (
          <p className="text-center text-xs text-lilac-100/45">Toque em uma região para ver os detalhes.</p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-lilac-100/60" aria-label="Legenda">
        <span>Registros no conjunto demonstrativo:</span>
        {[
          ['#4c3a9a', 'menos'],
          ['#8b6cf0', 'intermediário'],
          ['#c4b5fd', 'mais'],
        ].map(([c, l]) => (
          <span key={l} className="inline-flex items-center gap-2">
            <span className="h-3 w-4 rounded-sm" style={{ background: c }} aria-hidden />
            {l}
          </span>
        ))}
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-4 rounded-sm border border-white/10" aria-hidden />
          sem registros
        </span>
      </div>
    </div>
  )
}
