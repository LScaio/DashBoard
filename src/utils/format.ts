const nf = new Intl.NumberFormat('en-US')

export const formatNumber = (n: number) => nf.format(Math.round(n))

export function formatPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`
}

export function formatSignedPct(n: number | null): string {
  if (n === null) return 'new'
  const sign = n > 0 ? '+' : n < 0 ? '−' : '±'
  return `${sign}${Math.abs(n).toFixed(1)}%`
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
