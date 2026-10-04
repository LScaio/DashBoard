import { AnimatePresence, motion } from 'framer-motion'
import { Download, FileImage, FileSpreadsheet, FileText } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDashboard } from '../../context/dashboardStore'
import { downloadFile, incidentsToCSV } from '../../utils/export'
import { formatNumber } from '../../utils/format'

type Format = 'csv' | 'pdf' | 'png'

const OPTIONS: { id: Format; label: string; hint: string; Icon: typeof FileText }[] = [
  { id: 'csv', label: 'CSV', hint: 'Filtered records', Icon: FileSpreadsheet },
  { id: 'pdf', label: 'PDF', hint: 'Print current view', Icon: FileText },
  { id: 'png', label: 'PNG', hint: 'Not in prototype', Icon: FileImage },
]

export function ExportMenu() {
  const { records, filters, pushToast } = useDashboard()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const run = (format: Format) => {
    setOpen(false)
    if (format === 'csv') {
      if (!records.length) {
        pushToast({ tone: 'warning', title: 'Nothing to export', description: 'No records match the current filters.' })
        return
      }
      downloadFile(incidentsToCSV(records), `demo-incidents_${filters.dateFrom}_${filters.dateTo}.csv`, 'text/csv;charset=utf-8')
      pushToast({
        tone: 'success',
        title: `Exported ${formatNumber(records.length)} records (CSV)`,
        description: 'File is labelled as demonstration data — not official statistics.',
      })
    } else if (format === 'pdf') {
      pushToast({ tone: 'info', title: 'Opening print dialog', description: 'Choose “Save as PDF” to export the current view.' })
      window.setTimeout(() => window.print(), 300)
    } else {
      pushToast({
        tone: 'info',
        title: 'PNG export not available in prototype',
        description: 'Chart image export would be enabled in a production build.',
      })
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-[13px] font-medium text-white shadow-lg shadow-blue-900/40 transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
      >
        <Download className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Export</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-60 origin-top-right rounded-xl border border-white/10 bg-ink-800/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur"
          >
            <p className="px-2.5 pb-1.5 pt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Export data</p>
            {OPTIONS.map(({ id, label, hint, Icon }) => (
              <button
                key={id}
                type="button"
                role="menuitem"
                onClick={() => run(id)}
                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05] focus-visible:bg-white/[0.05] focus-visible:outline-none"
              >
                <Icon className="h-4 w-4 text-slate-400" aria-hidden />
                <span className="flex-1 text-[13px] font-medium text-slate-200">{label}</span>
                <span className="text-[11px] text-slate-500">{hint}</span>
              </button>
            ))}
            <p className="mt-1 border-t border-white/[0.06] px-2.5 pb-1 pt-2 text-[10.5px] leading-snug text-slate-500">
              Exports include the active filters and are marked as demo data.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
