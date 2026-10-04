import { motion, useReducedMotion } from 'framer-motion'

/** Pontos de dados fixos (determinísticos) que formam uma pequena constelação. */
const NODES = [
  [88, 150],
  [132, 98],
  [196, 72],
  [330, 76],
  [400, 118],
  [446, 196],
  [452, 300],
  [410, 392],
  [326, 448],
  [196, 446],
  [118, 394],
  [72, 300],
  [154, 214],
  [372, 232],
  [300, 360],
  [214, 330],
] as const
const LINKS = [
  [0, 1],
  [1, 2],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [9, 10],
  [10, 11],
  [11, 0],
  [0, 12],
  [12, 15],
  [13, 14],
  [4, 13],
  [8, 14],
  [9, 15],
] as const

/**
 * Ilustração abstrata: o símbolo ♀ desenhado como um instrumento científico,
 * rodeado por órbitas (ciência) e uma constelação de pontos (dados).
 */
export function HeroArt() {
  const reduce = useReducedMotion()
  const spin = (duration: number, dir = 1) =>
    reduce ? {} : { animate: { rotate: 360 * dir }, transition: { duration, repeat: Infinity, ease: 'linear' as const } }

  return (
    <svg
      viewBox="0 0 520 520"
      className="h-full w-full"
      role="img"
      aria-label="Ilustração abstrata: símbolo feminino cercado por órbitas e pontos de dados"
    >
      <defs>
        <radialGradient id="ha-glow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
          <stop offset="55%" stopColor="#6366f1" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ha-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ede9fe" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="ha-orbit" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0" />
          <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0" />
        </linearGradient>
      </defs>

      <circle cx="260" cy="240" r="250" fill="url(#ha-glow)" />

      {/* Constelação de dados */}
      <g stroke="#c4b5fd" strokeOpacity="0.18" strokeWidth="1">
        {LINKS.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />
        ))}
      </g>
      {NODES.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i % 4 === 0 ? 3.2 : 2}
          fill={i % 3 === 0 ? '#93c5fd' : '#ddd6fe'}
          initial={{ opacity: 0 }}
          animate={reduce ? { opacity: 0.8 } : { opacity: [0.3, 0.95, 0.3] }}
          transition={reduce ? undefined : { duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      {/* Órbitas */}
      {[0, 60, 120].map((angle, i) => (
        <motion.g key={angle} style={{ originX: '260px', originY: '210px' }} {...spin(60 + i * 20, i % 2 ? -1 : 1)}>
          <ellipse
            cx="260"
            cy="210"
            rx="190"
            ry="62"
            fill="none"
            stroke="url(#ha-orbit)"
            strokeWidth="1.2"
            transform={`rotate(${angle} 260 210)`}
          />
          <circle
            cx={260 + 190 * Math.cos((angle * Math.PI) / 180)}
            cy={210 + 190 * Math.sin((angle * Math.PI) / 180)}
            r="4"
            fill="#c4b5fd"
          />
        </motion.g>
      ))}

      {/* Símbolo ♀ como instrumento: círculo + haste + travessão */}
      <motion.circle
        cx="260"
        cy="210"
        r="92"
        fill="none"
        stroke="url(#ha-stroke)"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.3 }}
      />
      <circle cx="260" cy="210" r="70" fill="none" stroke="#c4b5fd" strokeOpacity="0.25" strokeDasharray="2 6" />
      <motion.path
        d="M260 302 V430 M212 376 H308"
        fill="none"
        stroke="url(#ha-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: 'easeInOut', delay: 1.6 }}
      />
      {/* Barras de dados dentro do círculo */}
      {[34, 52, 40, 66, 48].map((h, i) => (
        <motion.rect
          key={i}
          x={222 + i * 16}
          width="8"
          rx="2"
          fill="#a78bfa"
          fillOpacity={0.35 + i * 0.1}
          initial={{ y: 250, height: 0 }}
          animate={{ y: 250 - h, height: h }}
          transition={{ duration: 1, delay: 2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      <line x1="214" y1="250" x2="306" y2="250" stroke="#ede9fe" strokeOpacity="0.4" />
    </svg>
  )
}
