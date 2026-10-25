import { useNow } from '../hooks/useNow'
import type { SourceState } from '../hooks/useDataSource'
import { CHECK_INTERVAL_MS } from '../hooks/useDataSource'
import { clock, day, monthYear } from '../utils/format'

function LiveBadge() {
  const now = useNow(1000)
  return (
    <span
      className="flex items-center gap-2 rounded-lg border border-lilac/30 bg-lilac/10 px-2.5 py-1.5 text-lilac"
      title="Não há conexão com uma fonte em tempo real. O painel relê periodicamente o arquivo de dados publicado."
    >
      <span className="relative flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lilac opacity-50 [animation-duration:2.4s]" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-lilac" />
      </span>
      ATUALIZAÇÃO SIMULADA
      <time className="tabular font-semibold text-ink" dateTime={now.toISOString()} aria-label={`Horário atual ${clock(now)}`}>
        {clock(now)}
      </time>
    </span>
  )
}

/** One-line status of the simulated refresh: when data was loaded, last/next check, and what that means. */
function LiveStatus({ source }: { source: SourceState }) {
  const now = useNow(1000)
  const { loadedAt, checkedAt, nextCheckAt, lastResult, error, dataset } = source
  const prepared = dataset?.meta.get('Data de preparação')
  const remaining = nextCheckAt ? Math.max(0, Math.ceil((nextCheckAt.getTime() - now.getTime()) / 1000)) : null
  const progress = remaining === null ? 0 : 1 - (remaining * 1000) / CHECK_INTERVAL_MS

  const result =
    lastResult === 'unchanged'
      ? `última verificação ${clock(checkedAt!)} — arquivo sem alterações`
      : lastResult === 'changed'
        ? `arquivo de dados alterado — valores recarregados às ${clock(loadedAt!)}`
        : lastResult === 'failed'
          ? `falha na verificação às ${clock(checkedAt!)}${dataset ? ' — mantidos os últimos dados carregados' : ''}`
          : null

  return (
    <div className="relative border-b border-line px-5 py-1.5 text-[11px] text-ink-3 lg:px-6">
      {/* Announce check results only — not the per-second countdown. */}
      <span className="sr-only" aria-live="polite">
        {[loadedAt && `Dados carregados às ${clock(loadedAt)}.`, result].filter(Boolean).join(' ')}
      </span>
      <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        {loadedAt ? (
          <span>
            Dados carregados às <span className="tabular text-ink-2">{clock(loadedAt)}</span> de {day(loadedAt)}
          </span>
        ) : (
          <span>{error ? 'Não foi possível carregar o arquivo de dados' : 'Carregando dados da planilha…'}</span>
        )}
        {result && (
          <>
            <span aria-hidden>·</span>
            <span className={lastResult === 'failed' ? 'text-alert' : ''} title={error ?? undefined}>
              {result}
            </span>
          </>
        )}
        {remaining !== null && (
          <>
            <span aria-hidden>·</span>
            <span className="tabular">próxima verificação em {remaining} s</span>
          </>
        )}
        {prepared && (
          <>
            <span aria-hidden>·</span>
            <span>planilha preparada em {prepared}</span>
          </>
        )}
        <span aria-hidden>·</span>
        <span className="text-ink-2">Sem coleta em tempo real: os valores só mudam quando o arquivo de dados é atualizado.</span>
      </p>
      <span
        className="absolute bottom-[-1px] left-0 h-px bg-lilac/60 transition-[width] duration-1000 ease-linear"
        style={{ width: `${progress * 100}%` }}
        aria-hidden
      />
    </div>
  )
}

export function Header({ source, coverage }: { source: SourceState; coverage: { start: string | null; end: string | null } }) {
  return (
    // Sticky on desktop so the clock and refresh status stay visible while scrolling the table.
    <div className="z-20 bg-bg/90 backdrop-blur lg:sticky lg:top-0">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-rose text-sm font-bold text-white"
            aria-hidden
          >
            CD
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-[0.18em] text-white">CIÊNCIA DELAS</p>
            <h1 className="text-[13px] text-ink-2">
              <span className="font-medium text-ink">Mulheres e conflito</span> · Ucrânia — análise de dados sobre violência
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium tracking-wider">
          {coverage.start && coverage.end && (
            <span
              className="rounded-lg border border-line px-2.5 py-1.5 uppercase text-ink-2"
              title="Período coberto pelos indicadores da planilha"
            >
              {monthYear(coverage.start)} → {monthYear(coverage.end)}
            </span>
          )}
          <LiveBadge />
        </div>
      </header>
      <LiveStatus source={source} />
    </div>
  )
}
