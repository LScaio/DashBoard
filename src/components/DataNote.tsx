/** Always shown, whatever the spreadsheet says. */
const GENERAL = ['Casos documentados não representam necessariamente todos os casos; a subnotificação pode ser significativa.']

/** "Como interpretar os dados": the spreadsheet's main warning and rules (aba "Metadados"), verbatim. */
export function DataNote({ meta }: { meta: Map<string, string> }) {
  const fromSheet = [...meta].filter(([k]) => k === 'Aviso principal' || /^Regra \d+$/.test(k)).map(([, v]) => v)
  const notes = [...fromSheet, ...GENERAL]
  return (
    <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div className="rounded-2xl border border-line bg-card px-4 py-3 lg:col-span-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2">Como interpretar os dados</h2>
        <ul className="mt-2 grid gap-x-6 gap-y-1 text-xs text-ink-2 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose" aria-hidden />
              {n}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-violet/30 bg-gradient-to-br from-violet/15 to-rose/10 px-4 py-3">
        <p className="text-sm font-bold tracking-[0.14em] text-white">Ciência Delas</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-2">
          Dados podem revelar padrões que ajudam a compreender realidades invisibilizadas.
        </p>
        <a
          href="#dados"
          className="mt-2 inline-block text-xs font-medium text-lilac underline decoration-lilac/40 underline-offset-2 hover:decoration-lilac"
        >
          Ver a planilha completa com fontes ↓
        </a>
      </div>
    </section>
  )
}
