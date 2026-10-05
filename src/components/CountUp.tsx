import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
}

/** Animates a number from its previous value to `value` once visible. */
export function CountUp({ value, duration = 1.2, format = (n) => Math.round(n).toLocaleString('pt-BR'), className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const from = useRef(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      from.current = value
      return
    }
    const controls = animate(from.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setDisplay,
      onComplete: () => {
        from.current = value
      },
    })
    return () => {
      controls.stop()
      from.current = value
    }
  }, [value, inView, duration, reduce])

  return (
    <span ref={ref} className={className}>
      {format(reduce ? value : display)}
    </span>
  )
}
