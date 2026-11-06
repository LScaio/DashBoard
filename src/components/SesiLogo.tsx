import { SESI_LOGO } from '../brand'

/**
 * Official SESI logo, shown unmodified (no recoloring, natural aspect ratio)
 * on a white plate so it reads the same in the light and dark themes.
 */
export function SesiLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-lg bg-white px-2 py-1 ring-1 ring-line ${className}`}>
      <img src={SESI_LOGO.src} alt={SESI_LOGO.alt} className="block h-full w-auto" decoding="async" />
    </span>
  )
}
