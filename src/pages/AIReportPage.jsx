import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Copy } from 'lucide-react'
import { FlowStepper } from '../components/FlowStepper'
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
        <p className="text-gray-300">Candidate report not found.</p>
      </Card>
    )
  }

  const handleProof = () => {
    onGenerateProof(candidate.id)
    toast.success('Blockchain proof generated')
  }

  const handleCopyHash = async () => {
    if (!candidate.verification?.hash) {
      toast.error('Generate proof before copying hash')
      return
    }

    try {
      await navigator.clipboard.writeText(candidate.verification.hash)
      toast.success('Hash copied to clipboard')
    } catch {
      toast.error('Clipboard access is blocked on this browser')
    }
  }

  return (
    <div className="space-y-6 pb-14">
      <FlowStepper currentStep={3} />

      <ReportCard candidate={candidate} />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Blockchain Verification Module</h2>
            <p className="text-sm text-gray-400">Create immutable hiring proof for this AI report.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={candidate.verification?.status ? 'success' : 'primary'}
              onClick={handleProof}
            >
              {candidate.verification?.status
                ? 'Regenerate Proof'
                : 'Generate Proof'}
            </Button>
            <Button variant="secondary" onClick={handleCopyHash}>
              <Copy className="mr-1 size-4" />
              Copy Hash
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
            <p className="text-xs text-gray-400">Hash</p>
            <p className="mt-2 break-all text-sm font-mono text-gray-200">
              {candidate.verification?.hash || 'Not generated yet'}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
            <p className="text-xs text-gray-400">Timestamp</p>
            <p className="mt-2 text-sm text-gray-200">
              {formatDateTime(candidate.verification?.timestamp)}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
            <p className="text-xs text-gray-400">Status</p>
            <div className="mt-2">
              <Badge success={candidate.verification?.status === 'Verified on-chain'}>
                {candidate.verification?.status || 'Not Verified'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-950/70 p-3 text-sm text-gray-300">
            <p className="font-medium text-emerald-300">AI Evaluation Complete</p>
            <p className="mt-1 text-xs text-gray-400">Candidate signals and skill score generated.</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-950/70 p-3 text-sm text-gray-300">
            <p className="font-medium text-emerald-300">Proof Stored on Blockchain</p>
            <p className="mt-1 text-xs text-gray-400">Tamper-proof hash is available for recruiter verification.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
