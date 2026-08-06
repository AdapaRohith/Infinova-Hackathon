import { cn } from '../../utils/helpers'

const tones = {
  neutral: 'bg-ink-850 text-ink-300 ring-ink-700',
  ok: 'bg-ink-850 text-state-ok ring-ink-700',
  warn: 'bg-ink-850 text-state-warn ring-ink-700',
  bad: 'bg-ink-850 text-state-bad ring-ink-700',
  solid: 'bg-ink-50 text-ink-1000 ring-transparent',
}

export function Badge({ className, children, tone = 'neutral' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1',
        tones[tone] ?? tones.neutral,
        className,
      )}
    >
      {children}
    </span>
  )
}
