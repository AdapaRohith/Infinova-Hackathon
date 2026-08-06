import { cn } from '../../utils/helpers'

export function Table({ children, className = '' }) {
  return (
    <div className={cn('overflow-x-auto rounded-2xl border border-ink-800 bg-ink-925', className)}>
      <table className="min-w-full divide-y divide-ink-800 text-left text-sm">{children}</table>
    </div>
  )
}

export function TableHead({ children }) {
  return (
    <thead className="bg-ink-900 text-xs uppercase tracking-wider text-ink-400">{children}</thead>
  )
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-ink-800 text-ink-200">{children}</tbody>
}
