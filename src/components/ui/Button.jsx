import { cn } from '../../utils/helpers'

const variants = {
  primary:
    'bg-ink-50 text-ink-1000 hover:bg-white active:bg-ink-100',
  secondary:
    'bg-ink-900 text-ink-100 ring-1 ring-ink-700 hover:bg-ink-850 hover:ring-ink-600',
  ghost:
    'bg-transparent text-ink-300 ring-1 ring-transparent hover:bg-ink-900 hover:text-ink-50',
  outline:
    'bg-transparent text-ink-100 ring-1 ring-ink-700 hover:bg-ink-900 hover:ring-ink-500',
}

export function Button({ className, variant = 'primary', ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-1000',
        'disabled:cursor-not-allowed disabled:opacity-40',
        variants[variant] ?? variants.primary,
        className,
      )}
      {...props}
    />
  )
}
