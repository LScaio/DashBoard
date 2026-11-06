import { animate, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
}

/**
 * Shows the real value from the first paint (never a placeholder 0, so prints,
 * screenshots and screen readers always get the correct number). When the
 * value changes because new data arrived, it counts from the old value to the
 * new one — a visual cue that the figure was updated.
 */
export function CountUp({ value, duration = 1.2, format = (n) => Math.round(n).toLocaleString('pt-BR'), className }: CountUpProps) {
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(value)
  const shown = useRef(value)

  useEffect(() => {
    if (shown.current === value) return
    const from = shown.current
    shown.current = value
    const controls = animate(from, value, {
      duration: reduce ? 0 : duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setDisplay,
    })
    return () => controls.stop()
  }, [value, duration, reduce])

  return <span className={className}>{format(display)}</span>
}
