import { cn } from '../../utils/helpers'

const variants = {
  primary:
    'bg-zinc-100 text-zinc-950 hover:bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.25)]',
  secondary:
    'bg-zinc-900/80 text-zinc-100 hover:bg-zinc-800 shadow-[0_0_0_1px_rgba(255,255,255,0.15)]',
  ghost: 'bg-transparent text-zinc-300 hover:bg-zinc-900',
  success:
    'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 shadow-[0_0_0_1px_rgba(52,211,153,0.4)]',
}

export function Button({ className, variant = 'primary', ...props }) {
  return (
    <button
      className={cn(
        'rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
