import { cn } from '../../utils/format'

/** Small marker shown on every figure derived from the demonstration dataset. */
export function DemoTag({ label = 'Demo data', className }: { label?: string; className?: string }) {
  return (
    <span
      title="Synthetic demonstration data — not official statistics"
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded border border-warn/30 bg-warn/[0.08] px-1.5 py-0.5 font-mono text-[9.5px] font-medium uppercase tracking-wider text-warn',
        className,
      )}
    >
      <span className="h-1 w-1 rounded-full bg-warn" aria-hidden />
      {label}
    </span>
  )
}
