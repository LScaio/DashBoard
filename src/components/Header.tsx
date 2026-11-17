import { CREDIT } from '../brand'
import type { Theme } from '../theme'
import { SesiLogo } from './SesiLogo'
import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
  /** Subtitle under the brand */
  subtitle?: string
}

export function Header({ theme, onToggleTheme, subtitle = 'Mulheres e conflito · Ucrânia' }: HeaderProps) {
  return (
    <header className="border-b border-line bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-8 gap-y-3 px-4 py-4 sm:px-6 md:flex-nowrap">
        <a
          href="./"
          className="flex min-w-0 basis-full items-center gap-3.5 rounded-lg md:basis-auto md:flex-1"
          aria-label="Ciência Delas — página inicial"
        >
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--hero-from)] to-[var(--hero-to)] text-sm font-bold text-white"
            aria-hidden
          >
            CD
          </span>
          <span className="min-w-0">
            <span className="block max-w-[1000px] text-balance text-[13px] font-bold leading-snug tracking-[0.06em] text-ink sm:text-[15px] sm:tracking-[0.08em]">
              ELAS EM ZONA DE GUERRA: VISUALIZAÇÃO DE DADOS SOBRE A VIÔLENCIA CONTRA MULHERES NOS CONFLITOS ENTRE RÚSSIA E UCRÂNIA
            </span>
            <span className="mt-0.5 block truncate text-[12.5px] text-ink-2">{subtitle}</span>
          </span>
        </a>

        <div className="flex w-full items-center justify-between gap-3 md:w-auto md:shrink-0 md:justify-end">
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
