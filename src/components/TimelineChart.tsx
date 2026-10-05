import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Incident } from '../types'
import { fmt, monthlyCounts, type Series } from '../utils/stats'
import { Card } from './Card'
import { ChartTooltip } from './ChartTooltip'

const OPTIONS: { id: Series; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'sexual', label: 'Sexual' },
  { id: 'physical', label: 'Física' },
  { id: 'psychological', label: 'Psicológica' },
]
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const TICK = { fill: '#6f6a88', fontSize: 11 }

export function TimelineChart({ records, className }: { records: Incident[]; className?: string }) {
  const [series, setSeries] = useState<Series>('all')
  const data = useMemo(() => monthlyCounts(records, series), [records, series])
  const yearTicks = data.filter((d, i) => i === 0 || d.month.endsWith('-01')).map((d) => d.month)
  const color = series === 'sexual' ? '#ef5b6b' : '#a78bfa'

  return (
    <Card
      title="Incidentes documentados ao longo do tempo"
      className={className}
      delay={0.1}
      aside={
        <div
          className="flex max-w-full overflow-x-auto rounded-lg border border-line p-0.5"
          role="radiogroup"
          aria-label="Tipo de violência"
        >
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={series === o.id}
              onClick={() => setSeries(o.id)}
              className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs transition-colors ${series === o.id ? 'bg-lilac/20 font-medium text-white' : 'text-ink-3 hover:text-ink'}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="h-[240px] fit:h-full" role="img" aria-label="Gráfico de linha com incidentes documentados por mês, 2022 a 2026">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="tl-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#252238" vertical={false} />
            <XAxis
              dataKey="month"
              ticks={yearTicks}
              tickFormatter={(m: string) => m.slice(0, 4)}
              tick={TICK}
              tickLine={false}
              axisLine={{ stroke: '#252238' }}
            />
            <YAxis tick={TICK} tickLine={false} axisLine={false} width={44} allowDecimals={false} />
            <Tooltip
              cursor={{ stroke: '#6f6a88', strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                const p = payload?.[0]?.payload as { month: string; count: number } | undefined
                if (!active || !p) return null
                const [y, m] = p.month.split('-').map(Number)
                return (
                  <ChartTooltip
                    rows={[
                      ['Mês', `${MESES[m - 1]} ${y}`],
                      ['Incidentes', fmt(p.count)],
                    ]}
                  />
                )
              }}
            />
            <Area
              key={series}
              type="monotone"
              dataKey="count"
              stroke={color}
              strokeWidth={2}
              fill="url(#tl-fill)"
              activeDot={{ r: 4, stroke: '#14121f', strokeWidth: 2 }}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
