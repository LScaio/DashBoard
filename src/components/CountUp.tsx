import { animate, useReducedMotion } from 'framer-motion'
import { useLayoutEffect, useRef, useState } from 'react'

interface CountUpProps {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
}

/**
 * Animates a number to `value`: from 0 on first load when it is on screen, and from
 * the previous value whenever the data changes. Numbers off screen render their final
 * value directly, so a reader (or a print) never sees a placeholder 0.
 */
export function CountUp({ value, duration = 1.2, format = (n) => Math.round(n).toLocaleString('pt-BR'), className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const shown = useRef<number | null>(null)
  const [display, setDisplay] = useState(value)

  useLayoutEffect(() => {
    let from = shown.current
    if (from === null) {
      const r = ref.current?.getBoundingClientRect()
      from = r && r.top < window.innerHeight && r.bottom > 0 ? 0 : value
    }
    if (reduce || from === value) {
      shown.current = value
      setDisplay(value)
      return
    }
    setDisplay(from)
    const controls = animate(from, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => {
        shown.current = n
        setDisplay(n)
      },
    })
    return () => controls.stop()
  }, [value, duration, reduce])

  return (
    <span ref={ref} className={className}>
      {format(display)}
    </span>
  )
}
