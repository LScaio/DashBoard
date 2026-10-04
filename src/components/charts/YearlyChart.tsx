import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DEMO_DATA } from '../../data/demoData'
import { VIOLENCE_LABEL, VIOLENCE_TYPES } from '../../data/labels'
import type { ViolenceType } from '../../types'
import { countByYear, type YearPoint } from '../../utils/stats'

type Category = ViolenceType | 'all'

const TICK = { fill: 'rgba(237,233,254,0.55)', fontSize: 12 }

function YearTooltip({
  active,
  payload,
  category,
}: {
  active?: boolean
  payload?: readonly { payload?: YearPoint }[]
  category: Category
}) {
  const p = payload?.[0]?.payload
  if (!active || !p) return null
  return (
    <div className="rounded-2xl border border-white/10 bg-night-800/95 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur">
      <dl className="grid grid-cols-[auto_auto] gap-x-6 gap-y-1 text-[13px]">
        <dt className="text-lilac-100/50">Ano</dt>
        <dd className="tabular text-right font-medium text-white">{p.year}</dd>
        <dt className="text-lilac-100/50">Registros</dt>
        <dd className="tabular text-right font-medium text-white">{p.count}</dd>
        <dt className="text-lilac-100/50">Categoria</dt>
        <dd className="text-right text-white">{category === 'all' ? 'Todas' : VIOLENCE_LABEL[category]}</dd>
      </dl>
      <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-lilac-300/70">
        Dado demonstrativo{p.year === 2026 ? ' · ano em curso' : ''}
      </p>
    </div>
  )
}

export function YearlyChart() {
  const [category, setCategory] = useState<Category>('all')
  const data = useMemo(() => countByYear(DEMO_DATA, category), [category])
  const options: { id: Category; label: string }[] = [
    { id: 'all', label: 'Todas' },
    ...VIOLENCE_TYPES.map((t) => ({ id: t, label: VIOLENCE_LABEL[t] })),
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Categoria">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={category === o.id}
            onClick={() => setCategory(o.id)}
            className={
              category === o.id
                ? 'rounded-full bg-lilac-200 px-3.5 py-1.5 text-xs font-medium text-night-900'
                : 'rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-lilac-100/60 transition-colors hover:border-lilac-300/40 hover:text-white'
            }
          >
            {o.label}
          </button>
        ))}
      </div>

      <div
        className="mt-8 h-[300px] sm:h-[360px]"
        role="img"
        aria-label="Gráfico de linha: registros documentados por ano, de 2022 a 2026 (dados demonstrativos)"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: -8 }}>
            <defs>
              <linearGradient id="yc-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="yc-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#c4b5fd" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(237,233,254,0.07)" vertical={false} />
            <XAxis
              dataKey="year"
              tick={TICK}
              axisLine={{ stroke: 'rgba(237,233,254,0.15)' }}
              tickLine={false}
              padding={{ left: 12, right: 12 }}
            />
            <YAxis
              tick={TICK}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={48}
              label={{
                value: 'Registros documentados',
                angle: -90,
                position: 'insideLeft',
                offset: 14,
                style: { fill: 'rgba(237,233,254,0.45)', fontSize: 11 },
              }}
            />
            <Tooltip content={<YearTooltip category={category} />} cursor={{ stroke: 'rgba(196,181,253,0.35)', strokeDasharray: '3 4' }} />
            <Area
              key={category}
              type="monotone"
              dataKey="count"
              stroke="url(#yc-line)"
              strokeWidth={2.5}
              fill="url(#yc-fill)"
              dot={{ r: 4, fill: '#0d0b1f', stroke: '#c4b5fd', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#c4b5fd', stroke: '#0d0b1f', strokeWidth: 3 }}
              animationDuration={1400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-xs text-lilac-100/45">
        Dados demonstrativos para fins de prototipagem. 2026 é um ano em curso — os registros são parciais.
      </p>
    </div>
  )
}
