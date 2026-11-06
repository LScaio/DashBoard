import { Moon, Sun } from 'lucide-react'
import type { Theme } from '../theme'

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={dark}
      aria-label={dark ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
      title={dark ? 'Tema claro' : 'Tema escuro'}
      className="group inline-flex h-9 items-center gap-2 rounded-full border border-line bg-card px-1 text-ink-2 transition-colors hover:text-ink"
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${dark ? '' : 'bg-accent text-accent-ink'}`}
      >
        <Sun size={15} aria-hidden />
      </span>
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${dark ? 'bg-accent text-accent-ink' : ''}`}
      >
        <Moon size={15} aria-hidden />
      </span>
    </button>
  )
}
