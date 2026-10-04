import { FlaskConical } from 'lucide-react'

/** Selo de transparência: os números exibidos são ilustrativos. */
export function DemoTag({
  text = 'Dados ilustrativos — não representam estatísticas oficiais',
  tone = 'dark',
}: {
  text?: string
  tone?: 'dark' | 'light'
}) {
  return (
    <span
      className={
        tone === 'dark'
          ? 'inline-flex items-center gap-1.5 rounded-full border border-lilac-300/25 bg-lilac-300/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.14em] text-lilac-200/90'
          : 'inline-flex items-center gap-1.5 rounded-full border border-violet/25 bg-violet/[0.06] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.14em] text-violet'
      }
    >
      <FlaskConical className="h-3 w-3 shrink-0" aria-hidden />
      {text}
    </span>
  )
}
