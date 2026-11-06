import type { ReactNode } from 'react'
import { CREDIT } from '../brand'
import type { Theme } from '../theme'
import { SesiLogo } from './SesiLogo'
import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
  /** Short status shown in the header (e.g. latest data date) */
  status?: ReactNode
  /** Subtitle under the brand */
  subtitle?: string
}

export function Header({ theme, onToggleTheme, status, subtitle = 'Mulheres e conflito · Ucrânia' }: HeaderProps) {
  return (
    <header className="border-b border-line bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
        <a href="./" className="flex min-w-0 items-center gap-3 rounded-lg" aria-label="Ciência Delas — página inicial">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--hero-from)] to-[var(--hero-to)] text-sm font-bold text-white"
            aria-hidden
          >
            CD
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block text-[15px] font-bold tracking-[0.16em] text-ink">ELAS EM ZONA DE GUERRAA: VISUALIZAÇÃO DE DADOS SOBRE A VIÔLENCIA CONTRA MULHERES NOS CONFLITOS ENTRE RÚSSIA E UCRÂNIA</span>
            <span className="block truncate text-[12.5px] text-ink-2">{subtitle}</span>
          </span>
        </a>

        <div className="flex items-center gap-3">
          {status && <div className="hidden lg:block">{status}</div>}
          <div className="flex items-center gap-2.5" title={CREDIT}>
            <span className="hidden text-right text-[10.5px] leading-tight text-ink-3 xl:block">
              Projeto desenvolvido por
              <br />
              alunos do SESI
            </span>
            <SesiLogo className="h-9" />
          </div>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  )
}
