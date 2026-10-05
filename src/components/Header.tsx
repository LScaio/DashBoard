export function Header() {
  return (
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
      <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider">
        <span className="rounded-lg border border-line px-2.5 py-1.5 text-ink-2">24 FEV 2022 → ATUAL</span>
        <span className="rounded-lg border border-rose/30 bg-rose/10 px-2.5 py-1.5 text-rose">DADOS DEMONSTRATIVOS</span>
      </div>
    </header>
  )
}
