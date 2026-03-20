import { cn } from '../../utils/helpers'

export function Card({ className, children }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}
