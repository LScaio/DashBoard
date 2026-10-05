export const HEX_R = 36
export const HEX_W = Math.sqrt(3) * HEX_R
export const MAP_PAD = 24

export function hexCenter(col: number, row: number): { x: number; y: number } {
  return {
    x: MAP_PAD + col * HEX_W + (row % 2 ? HEX_W / 2 : 0) + HEX_W / 2,
    y: MAP_PAD + HEX_R + row * 1.5 * HEX_R,
  }
}

/** Pointy-top hexagon polygon points around a centre. */
export function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 90)
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  }).join(' ')
}

export const MAP_WIDTH = MAP_PAD * 2 + 8.5 * HEX_W
export const MAP_HEIGHT = MAP_PAD * 2 + 2 * HEX_R + 4 * 1.5 * HEX_R
