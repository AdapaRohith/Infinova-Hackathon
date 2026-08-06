import { cn } from '../../utils/helpers'

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-ink-800 bg-ink-925 p-6 transition-colors duration-200 hover:border-ink-700',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
