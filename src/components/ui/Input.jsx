import { cn } from '../../utils/helpers'

export function Input({ className, label, ...props }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-zinc-300">
      {label ? <span>{label}</span> : null}
      <input
        className={cn(
          'rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-400',
          className,
        )}
        {...props}
      />
    </label>
  )
}
