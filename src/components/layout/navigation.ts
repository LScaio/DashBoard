export const NAV_ITEMS = [
  { id: 'contexto', label: 'Contexto' },
  { id: 'dados', label: 'Dados' },
  { id: 'tempo', label: 'Tempo' },
  { id: 'mapas', label: 'Mapas' },
  { id: 'historias', label: 'Histórias' },
  { id: 'ciencia', label: 'Ciência' },
] as const

export const NAV_IDS = NAV_ITEMS.map((i) => i.id)
