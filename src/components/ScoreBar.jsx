export function ScoreBar({ score, label = 'Skill Score' }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-400">{label}</span>
        <span className="font-semibold text-ink-50">{safeScore}/100</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-ink-850"
        role="progressbar"
        aria-valuenow={safeScore}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-linear-to-r from-ink-500 to-ink-50 transition-[width] duration-700 ease-out"
          style={{ width: `${safeScore}%` }}
        />
      </div>
    </div>
  )
}
