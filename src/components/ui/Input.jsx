import { cn } from '../../utils/helpers'

export const fieldClasses =
  'w-full rounded-xl border border-ink-700 bg-ink-950 px-4 py-2.5 text-sm text-ink-50 outline-none transition-colors placeholder:text-ink-500 hover:border-ink-600 focus:border-ink-400 focus:ring-2 focus:ring-ink-700'

export function Input({ className, wrapperClassName, label, hint, ...props }) {
  return (
    <label className={cn('flex flex-col gap-2 text-sm text-ink-300', wrapperClassName)}>
      {label ? <span className="font-medium text-ink-200">{label}</span> : null}
      <input className={cn(fieldClasses, className)} {...props} />
      {hint ? <span className="text-xs text-ink-500">{hint}</span> : null}
    </label>
  )
}
