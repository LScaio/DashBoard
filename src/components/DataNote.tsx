const NOTES = [
  'Casos documentados não representam necessariamente todos os casos.',
  'A subnotificação pode ser significativa.',
  'Os dados deste protótipo são demonstrativos.',
]

export function DataNote() {
  return (
    <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div className="rounded-2xl border border-line bg-card px-4 py-3 lg:col-span-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2">Como interpretar os dados</h2>
        <ul className="mt-2 grid gap-x-6 gap-y-1 text-xs text-ink-2 md:grid-cols-3">
          {NOTES.map((n) => (
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
      </div>
    </section>
  )
}
