import { TriangleAlert } from 'lucide-react'
import { Card } from '../ui/Card'

const ITEMS = [
  'Documented incidents ≠ total incidents',
  'Underreporting is likely',
  'Access to affected areas varies',
  'Sources may use different definitions',
  'Demonstration data is not official statistics',
]

export function DataLimitations({ className }: { className?: string }) {
  return (
    <Card title="Data limitations" className={className} actions={<TriangleAlert className="h-4 w-4 text-warn" />}>
      <ul className="space-y-2">
        {ITEMS.map((t) => (
          <li key={t} className="flex gap-2 text-xs text-ink-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warn" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
    </Card>
  )
}
