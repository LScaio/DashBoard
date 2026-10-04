import { useEffect, useState } from 'react'

/** Scroll-spy: the active section is the last anchor whose top has passed 30% of the viewport. */
export function useActiveSection(ids: string[], enabled = true): string {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    if (!enabled) return
    let frame = 0
    const update = () => {
      frame = 0
      const threshold = window.innerHeight * 0.3
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= threshold) current = id
      }
      // At the very bottom, the last section is active even if its header is low on the page.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = ids[ids.length - 1]
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [ids, enabled])

  return active
}
