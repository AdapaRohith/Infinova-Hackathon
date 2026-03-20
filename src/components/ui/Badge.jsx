import { cn } from '../../utils/helpers'

export function Badge({ className, children, success = false }) {
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 text-xs font-medium',
        success
          ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40'
          : 'bg-zinc-700/40 text-zinc-300 ring-1 ring-white/10',
        className,
      )}
    >
      {children}
    </span>
  )
}
