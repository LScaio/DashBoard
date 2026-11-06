import { useMemo } from 'react'
import { encode } from 'uqr'

/**
 * QR code generated locally (no external service). Always dark modules on a
 * white quiet zone, in both themes, so every phone camera can read it.
 */
export function QrCode({ value, size = 128, label }: { value: string; size?: number; label: string }) {
  const { path, n } = useMemo(() => {
    const qr = encode(value, { ecc: 'M', border: 2 })
    let d = ''
    qr.data.forEach((row, y) =>
      row.forEach((on, x) => {
        if (on) d += `M${x} ${y}h1v1h-1z`
      }),
    )
    return { path: d, n: qr.size }
  }, [value])

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${n} ${n}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
      className="block rounded-md bg-white"
    >
      <rect width={n} height={n} fill="#ffffff" />
      <path d={path} fill="#1b1530" />
    </svg>
  )
}
