/** Reference instant for the live counter: start of 24 Feb 2022 in Kyiv (EET, UTC+2). */
export const INVASION_START_ISO = '2022-02-24T00:00:00+02:00'
export const INVASION_START_MS = Date.parse(INVASION_START_ISO)

/**
 * Public address of the published dashboard. The QR code points to the sources
 * page under this URL. Override at build time with VITE_SITE_URL if the site
 * moves (e.g. VITE_SITE_URL=https://example.org/ciencia-delas/ npm run build).
 */
export const CANONICAL_SITE_URL: string = import.meta.env.VITE_SITE_URL || 'https://lscaio.github.io/DashBoard/'

export const SOURCES_PAGE = 'fontes.html'

/** How often the open page checks for new data files (no reload needed). */
export const POLL_INTERVAL_MS = 5 * 60_000
/** How often the browser re-queries the UNHCR API directly. */
export const LIVE_API_INTERVAL_MS = 6 * 60 * 60_000
/** A source published within this many days is flagged as "recent". */
export const RECENT_DAYS = 60

/** URL of the sources page: the current site when hosted, the canonical one otherwise (localhost, file previews). */
export function sourcesPageUrl(): string {
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '' || hostname.endsWith('.local')
    if (/^https?:$/.test(protocol) && !isLocal) return new URL(SOURCES_PAGE, window.location.href).href
  }
  return new URL(SOURCES_PAGE, CANONICAL_SITE_URL).href
}
