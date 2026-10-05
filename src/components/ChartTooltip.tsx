export function ChartTooltip({ rows }: { rows: [string, string][] }) {
  return (
    <div className="rounded-lg border border-line bg-[#1b1830]/95 px-3 py-2 text-xs shadow-xl shadow-black/40">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-5">
          <span className="text-ink-3">{k}</span>
          <span className="tabular font-medium text-ink">{v}</span>
        </div>
      ))}
    </div>
  )
}
