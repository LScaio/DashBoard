import { motion } from 'framer-motion'

export function LogoMark({ size = 36, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden className="shrink-0">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="39" height="39" rx="10" fill="#0b1324" stroke="rgba(96,165,250,0.25)" />
      <motion.path
        d="M20 7.5 30.8 13.75v12.5L20 32.5 9.2 26.25v-12.5z"
        fill="none"
        stroke="url(#logo-g)"
        strokeWidth="2"
        strokeLinejoin="round"
        initial={animated ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="20"
        cy="20"
        r="3.5"
        fill="#93c5fd"
        initial={animated ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: animated ? 0.8 : 0, duration: 0.4 }}
      />
      <path d="M20 13v3.2M20 23.8V27M14 20h2.6M23.4 20H26" stroke="#60a5fa" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="min-w-0 leading-tight">
      <p className="text-[11.5px] font-semibold leading-[1.35] tracking-[0.12em] text-slate-100">
        UKRAINE <span className="text-slate-500">—</span>
        <br />
        WOMEN &amp; CONFLICT
      </p>
      {!compact && <p className="mt-0.5 text-[10.5px] leading-tight text-slate-400">Humanitarian Intelligence Dashboard</p>}
    </div>
  )
}
