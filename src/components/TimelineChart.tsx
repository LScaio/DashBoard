import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type LabelProps,
  type XAxisTickContentProps,
} from 'recharts'
import { annualEstimates, CUMULATIVE_INDICATOR, latestRow, numberOf, type AnnualPoint } from '../data/dataset'
import { useMediaQuery } from '../hooks/useMediaQuery'
import type { DataRow } from '../types'
import { fmt, monthYear, pct } from '../utils/format'
import { Card } from './Card'
import { ChartTooltip } from './ChartTooltip'

const ESTIMATE = '#f59ccf'
const TICK = { fill: '#6f6a88', fontSize: 11 }

/** "jan–jul" for a partial-year period. */
const months = (p: AnnualPoint) => `${monthYear(p.row.start!).slice(0, 3)}–${monthYear(p.row.end!).slice(0, 3)}`

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-ink-2">
      <span className="flex items-center gap-1.5">
        <span className="fill-estimate h-2.5 w-3.5 rounded-sm" aria-hidden />
        Estimativa não verificada
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-3.5 rounded-sm border border-dashed border-estimate/80 bg-estimate/15" aria-hidden />
        Período parcial
      </span>
    </div>
  )
}

/**
 * Historical chart: the spreadsheet's annual estimates of women among civilian
 * casualties. Every bar is an estimate; partial periods are drawn dashed and
 * labelled so they are not read as a full year.
 */
export function TimelineChart({ rows, className }: { rows: DataRow[]; className?: string }) {
  const points = useMemo(() => annualEstimates(rows), [rows])
  const cumulative = latestRow(rows, CUMULATIVE_INDICATOR)
  const sum = points.reduce((s, p) => s + p.value, 0)
  const partial = points.filter((p) => p.partial)
  // Narrow screens: shorter axis labels so neighbouring years don't collide.
  const wide = useMediaQuery('(min-width: 640px)')

  const renderTick = ({ x, y, index }: XAxisTickContentProps) => {
    const p = points[index]
    if (!p) return <g />
    return (
      <g transform={`translate(${x},${y})`}>
        <text dy={12} textAnchor="middle" fill={p.partial ? '#a9a4bf' : '#ece9f5'} fontSize={11} fontWeight={600}>
          {p.partial ? (wide ? `${p.year} (${months(p)})` : `${p.year}*`) : p.year}
        </text>
        <text dy={26} textAnchor="middle" fill="#6f6a88" fontSize={10}>
          {wide && p.partial ? 'parcial · ' : ''}
          {p.proportion === null ? '—' : wide ? `proporção ${pct(p.proportion)}` : pct(p.proportion)}
        </text>
      </g>
    )
  }

  // Drawn as plain SVG text so "≈ 4.100" never wraps inside the bar width.
  const renderValue = ({ x, y, width, value }: LabelProps) => (
    <text x={Number(x) + Number(width) / 2} y={Number(y) - 7} textAnchor="middle" fill="#ece9f5" fontSize={11} fontWeight={600}>
      ≈ {fmt(Number(value))}
    </text>
  )

  return (
    <Card title="Mulheres vítimas civis por ano — estimativas" className={className} delay={0.1} aside={<Legend />}>
      <div className="flex h-full flex-col">
        <div
          className="h-[260px]"
          role="img"
          aria-label={`Gráfico de colunas com estimativas não verificadas de mulheres vítimas civis por ano: ${points
            .map((p) => `${p.year}${p.partial ? ` (${months(p)}, parcial)` : ''} aproximadamente ${fmt(p.value)}`)
            .join('; ')}.`}
        >
          {points.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={points} margin={{ top: 20, right: 6, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#252238" vertical={false} />
                <XAxis dataKey="year" interval={0} height={36} tick={renderTick} tickLine={false} axisLine={{ stroke: '#252238' }} />
                <YAxis tick={TICK} tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => fmt(v)} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  content={({ active, payload }) => {
                    const p = payload?.[0]?.payload as AnnualPoint | undefined
                    if (!active || !p) return null
                    return (
                      <ChartTooltip
                        rows={[
                          ['Período', p.row.periodo],
                          ['Estimativa', `≈ ${fmt(p.value)}`],
                          ['Status', 'Estimativa não verificada'],
                          ['Método', p.row.metodo],
                          ['Base', p.row.fonte],
                          ['Linha', String(p.row.line)],
                        ]}
                        note={p.row.observacoes}
                      />
                    )
                  }}
                />
                <Bar dataKey="value" maxBarSize={44} radius={[4, 4, 0, 0]} animationDuration={900} animationEasing="ease-out">
                  {points.map((p) => (
                    <Cell
                      key={p.row.line}
                      fill={ESTIMATE}
                      fillOpacity={p.partial ? 0.18 : 0.55}
                      stroke={ESTIMATE}
                      strokeOpacity={0.8}
                      strokeWidth={1}
                      strokeDasharray={p.partial ? '4 3' : undefined}
                    />
                  ))}
                  <LabelList dataKey="value" content={renderValue} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex h-full items-center justify-center text-xs text-ink-3">Nenhuma estimativa anual encontrada na planilha.</p>
          )}
        </div>
        <p className="mt-2 text-[10.5px] leading-snug text-ink-3">
          Cálculo não oficial ({[...new Set(points.map((p) => p.row.fonte))].join(', ')}): uma proporção de mulheres aplicada ao total de
          vítimas civis de cada ano — não é contagem publicada pela instituição citada. As proporções mudam entre anos, então as diferenças
          não comprovam tendência.
          {!wide && ' Percentual sob cada ano: proporção aplicada.'}
          {partial.length > 0 &&
            ` ${partial.map((p) => `${p.year}${wide ? '' : '*'} cobre só ${months(p)}`).join('; ')}: não comparar com ano completo.`}
          {cumulative && (
            <>
              {' '}
              Soma: ≈ {fmt(sum)}{' '}
              {sum === numberOf(cumulative)
                ? '— igual à estimativa acumulada da planilha.'
                : `— difere da estimativa acumulada (${cumulative.valorBruto}).`}
            </>
          )}
        </p>
      </div>
    </Card>
  )
}
