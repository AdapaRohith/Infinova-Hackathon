import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Table, TableBody, TableHead } from './ui/Table'
import { IdentityAlert } from './IdentityAlert'
import { getTxExplorerUrl } from '../utils/blockchain'

const verdictTone = {
  positive: 'ok',
  negative: 'bad',
  caution: 'warn',
}

export function CandidateTable({ candidates, onViewReport }) {
  if (!candidates.length) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-700 bg-ink-925 p-8 text-center">
        <p className="text-sm text-ink-200">No candidates match the current filters.</p>
        <p className="mt-2 text-xs text-ink-500">
          Try widening the score range, clearing the skill filter, or disabling verified-only mode.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHead>
        <tr>
          <th className="px-4 py-3 font-medium">Candidate</th>
          <th className="px-4 py-3 font-medium">Score</th>
          <th className="px-4 py-3 font-medium">Verdict</th>
          <th className="px-4 py-3 font-medium">Identity</th>
          <th className="px-4 py-3 font-medium">Proof</th>
          <th className="px-4 py-3 font-medium">Actions</th>
        </tr>
      </TableHead>
      <TableBody>
        {candidates.map((candidate) => {
          const explorerUrl = getTxExplorerUrl(candidate.verification?.txHash)
          const isVerified = Boolean(candidate.verification?.status?.startsWith('Verified'))
          const isPending = candidate.verification?.status?.startsWith('Pending')

          return (
            <tr key={candidate.id} className="transition-colors hover:bg-ink-900">
              <td className="px-4 py-3">
                <p className="font-medium text-ink-50">{candidate.name}</p>
                <p className="text-xs text-ink-500">{candidate.email}</p>
              </td>
              <td className="px-4 py-3 text-ink-100">{candidate.analysis?.score ?? '—'}</td>
              <td className="px-4 py-3">
                <Badge tone={verdictTone[candidate.analysis?.assessment?.verdictTone] ?? 'neutral'}>
                  {candidate.analysis?.assessment?.verdict || 'Pending'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                {candidate.analysis?.identityCheck ? (
                  <IdentityAlert identityCheck={candidate.analysis.identityCheck} compact />
                ) : (
                  <span className="text-xs text-ink-500">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <Badge tone={isVerified ? 'ok' : isPending ? 'warn' : 'neutral'}>
                  {isVerified ? 'Verified' : isPending ? 'Pending' : 'Not Verified'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" onClick={() => onViewReport(candidate)}>
                    Quick View
                  </Button>
                  <Link
                    to={`/report/${candidate.id}`}
                    className="inline-flex items-center gap-1 rounded-xl border border-ink-700 bg-ink-900 px-3 py-2 text-sm font-medium text-ink-200 transition-colors hover:border-ink-500 hover:text-ink-50"
                  >
                    Full Report
                  </Link>
                  <a
                    href={explorerUrl || undefined}
                    target="_blank"
                    rel="noreferrer"
                    aria-disabled={!explorerUrl}
                    className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                      explorerUrl
                        ? 'border-ink-700 bg-ink-900 text-ink-200 hover:border-ink-500 hover:text-ink-50'
                        : 'pointer-events-none cursor-not-allowed border-ink-800 bg-ink-925 text-ink-600'
                    }`}
                  >
                    <ExternalLink className="size-3.5" />
                    {explorerUrl ? 'Explorer' : 'No Proof'}
                  </a>
                </div>
              </td>
            </tr>
          )
        })}
      </TableBody>
    </Table>
  )
}
