import { CREDIT } from '../brand'
import { SOURCES_PAGE } from '../config'
import { SesiLogo } from './SesiLogo'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-4 text-[12px] text-ink-3 sm:px-6">
        <div className="flex items-center gap-3">
          <SesiLogo className="h-7" />
          <p>
            <span className="font-semibold text-ink-2">Ciência Delas</span> · {CREDIT}
          </p>
        </div>
        <p>
          Dados: ONU (ACNUDH, ACNUR) e Procuradoria-Geral da Ucrânia ·{' '}
          <a href={SOURCES_PAGE} className="text-accent underline-offset-2 hover:underline">
            fontes e metodologia
          </a>
        </p>
      </div>
    </footer>
  )
}
