import type { ViolenceType } from '../types'

export const VIOLENCE_TYPES: ViolenceType[] = ['sexual', 'physical', 'psychological', 'displacement', 'detention', 'other']

export const VIOLENCE_LABEL: Record<ViolenceType, string> = {
  sexual: 'Violência sexual',
  physical: 'Violência física',
  psychological: 'Violência psicológica',
  displacement: 'Deslocamento forçado',
  detention: 'Detenção / abdução',
  other: 'Outros',
}

/** Uma frase curta para mostrar que violência não é só agressão física. */
export const VIOLENCE_NOTE: Record<ViolenceType, string> = {
  sexual: 'Frequentemente a forma mais subnotificada.',
  physical: 'A forma mais visível — mas não a única.',
  psychological: 'Medo, ameaças e controle deixam marcas que não aparecem.',
  displacement: 'Perder a casa, a rede de apoio e a rotina.',
  detention: 'Privação de liberdade e desaparecimento.',
  other: 'Formas que nem sempre cabem nas categorias.',
}
