export function ScoreBar({ score }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">Skill Score</span>
        <span className="font-semibold text-zinc-100">{score}/100</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-zinc-300 to-white transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}
