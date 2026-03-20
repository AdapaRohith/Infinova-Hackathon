import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

export function CandidateTable({ candidates, onViewReport }) {
  if (!candidates.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-950/40 p-8 text-center">
        <p className="text-sm text-zinc-300">No candidates match the current filters.</p>
        <p className="mt-2 text-xs text-zinc-500">Try widening score range or disabling verified-only mode.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm">
        <thead className="bg-zinc-900/90 text-zinc-400">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Score</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-zinc-950/60 text-zinc-200">
          {candidates.map((candidate, index) => (
            <tr key={candidate.id} className="hover:bg-zinc-900/60">
              <td className="px-4 py-3">{candidate.name}</td>
              <td className="px-4 py-3">
                <span className="rounded-lg bg-zinc-800/70 px-2 py-1 text-xs text-zinc-100">#{index + 1}</span>
                <span className="ml-2">{candidate.analysis?.score ?? '—'}</span>
              </td>
              <td className="px-4 py-3">
                <Badge success={candidate.verification?.status === 'Verified on-chain'}>
                  {candidate.verification?.status ? 'Verified' : 'Not Verified'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Button variant="secondary" onClick={() => onViewReport(candidate)}>
                  View Report
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
