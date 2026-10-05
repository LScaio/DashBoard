const nf = new Intl.NumberFormat('en-US')

export const fmt = (n: number) => nf.format(Math.round(n))

export const pct = (n: number, digits = 1) => `${n.toFixed(digits)}%`

export function signedPct(n: number | null): string {
  if (n === null) return 'n/a'
  return `${n > 0 ? '+' : n < 0 ? '−' : '±'}${Math.abs(n).toFixed(1)}%`
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
