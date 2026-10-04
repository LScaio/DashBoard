import { cn } from '../../utils/format'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-md bg-white/[0.04]', className)} aria-hidden>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  )
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="flex flex-col gap-3" style={{ height }} role="status" aria-label="Loading chart">
      <div className="flex flex-1 items-end gap-2">
        {Array.from({ length: 18 }).map((_, i) => (
          <Skeleton key={i} className="flex-1" />
        ))}
      </div>
      <Skeleton className="h-3 w-full" />
    </div>
  )
}
