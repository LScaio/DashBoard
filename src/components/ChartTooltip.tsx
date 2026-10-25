export function ChartTooltip({ rows, note }: { rows: [string, string][]; note?: string }) {
  return (
    <div className="max-w-[300px] rounded-lg border border-line bg-[#1b1830]/95 px-3 py-2 text-xs shadow-xl shadow-black/40">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-5">
          <span className="shrink-0 text-ink-3">{k}</span>
          <span className="tabular text-right font-medium text-ink">{v}</span>
        </div>
      ))}
      {note && <p className="mt-1.5 border-t border-line pt-1.5 leading-snug text-ink-2">{note}</p>}
    </div>
  )
}
