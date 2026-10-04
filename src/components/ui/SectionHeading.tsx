import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  tone?: 'dark' | 'light'
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, lead, tone = 'dark', align = 'left' }: SectionHeadingProps) {
  const center = align === 'center'
  return (
    <Reveal className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className={`text-[11px] font-medium uppercase tracking-[0.28em] ${tone === 'dark' ? 'text-lilac-300' : 'text-violet'}`}>
        {eyebrow}
      </p>
      <h2
        className={`mt-4 font-display text-[34px] font-light leading-[1.08] tracking-tight sm:text-5xl lg:text-[56px] ${tone === 'dark' ? 'text-white' : 'text-paper-ink'}`}
      >
        {title}
      </h2>
      {lead && (
        <p className={`mt-5 text-base leading-relaxed sm:text-lg ${tone === 'dark' ? 'text-lilac-100/70' : 'text-paper-ink/70'}`}>{lead}</p>
      )}
    </Reveal>
  )
}
