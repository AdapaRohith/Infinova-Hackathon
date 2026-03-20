import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ReportCard } from '../components/ReportCard'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { formatDateTime } from '../utils/helpers'

export function AIReportPage({ candidates, onGenerateProof }) {
  const { candidateId } = useParams()
  const candidate = useMemo(
    () => candidates.find((item) => item.id === candidateId),
    [candidateId, candidates],
  )

  if (!candidate) {
    return (
      <Card>
        <p className="text-zinc-300">Candidate report not found.</p>
      </Card>
    )
  }

  const handleProof = () => {
    onGenerateProof(candidate.id)
    toast.success('Blockchain proof generated')
  }

  return (
    <div className="space-y-6 pb-14">
      <ReportCard candidate={candidate} />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Blockchain Verification Module</h2>
            <p className="text-sm text-zinc-400">Create immutable hiring proof for this AI report.</p>
          </div>
          <Button
            variant={candidate.verification?.status ? 'success' : 'primary'}
            onClick={handleProof}
          >
            {candidate.verification?.status
              ? 'Regenerate Blockchain Proof'
              : 'Generate Blockchain Proof'}
          </Button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
            <p className="text-xs text-zinc-500">Hash</p>
            <p className="mt-2 break-all text-sm text-zinc-200">
              {candidate.verification?.hash || 'Not generated yet'}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
            <p className="text-xs text-zinc-500">Timestamp</p>
            <p className="mt-2 text-sm text-zinc-200">
              {formatDateTime(candidate.verification?.timestamp)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
            <p className="text-xs text-zinc-500">Status</p>
            <div className="mt-2">
              <Badge success={candidate.verification?.status === 'Verified on-chain'}>
                {candidate.verification?.status || 'Not Verified'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
