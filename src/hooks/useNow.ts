import { useEffect, useState } from 'react'

/** Current time, refreshed every `stepMs`. Used only for clocks and countdowns, never for data. */
export function useNow(stepMs = 1000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), stepMs)
    return () => clearInterval(id)
  }, [stepMs])
  return now
}
