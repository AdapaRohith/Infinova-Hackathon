import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import { FlowStepper } from '../components/FlowStepper'
import { ReportCard } from '../components/ReportCard'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Loader } from '../components/ui/Loader'
import { formatDateTime } from '../utils/helpers'

export function AIReportPage({ candidates, onGenerateProof }) {
  const { candidateId } = useParams()
  const [isGeneratingProof, setIsGeneratingProof] = useState(false)
  const [copied, setCopied] = useState(false)
  const [revealTick, setRevealTick] = useState(0)
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

  const handleProof = async () => {
    setIsGeneratingProof(true)
    toast('Generating blockchain proof...', { icon: '⛓️' })

    await new Promise((resolve) => {
      setTimeout(resolve, 1400)
    })

    onGenerateProof(candidate.id)
    setRevealTick((value) => value + 1)
    setIsGeneratingProof(false)
    toast.success('Blockchain proof generated')
  }

  const handleCopyHash = async () => {
    if (!candidate.verification?.hash) {
      toast.error('Generate proof before copying hash')
      return
    }

    try {
      await navigator.clipboard.writeText(candidate.verification.hash)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
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
              disabled={isGeneratingProof}
              onClick={handleProof}
            >
              {isGeneratingProof
                ? 'Generating blockchain proof...'
                : candidate.verification?.status
                  ? 'Regenerate Proof'
                  : 'Generate Proof'}
            </Button>

            <div className="relative">
              <Button variant="secondary" onClick={handleCopyHash}>
                <Copy className="mr-1 size-4" />
                Copy Hash
              </Button>
              <AnimatePresence>
                {copied ? (
                  <Motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md border border-gray-700 bg-gray-950 px-2 py-1 text-xs text-gray-200"
                  >
                    Copied!
                  </Motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isGeneratingProof ? (
            <Motion.div
              key="proof-loading"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-5 rounded-2xl border border-gray-800 bg-gray-950/70 p-5"
            >
              <Loader label="Generating blockchain proof..." />
            </Motion.div>
          ) : (
            <Motion.div
              key={`proof-ready-${revealTick}`}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="mt-5 grid gap-4 md:grid-cols-3"
            >
              <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                <p className="text-xs text-gray-400">Hash</p>
                <p className="mt-2 break-all text-sm font-mono text-gray-200">
                  {candidate.verification?.hash || 'Not generated yet'}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                <p className="text-xs text-gray-400">Timestamp</p>
                <p className="mt-2 text-sm text-gray-300">
                  {formatDateTime(candidate.verification?.timestamp)}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 shadow-lg shadow-emerald-500/10">
                <p className="text-xs text-gray-400">Status</p>
                <div className="mt-2 flex items-center gap-2">
                  {candidate.verification?.status === 'Verified on-chain' ? (
                    <span className="relative inline-flex size-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
                    </span>
                  ) : null}
                  <Badge success={candidate.verification?.status === 'Verified on-chain'}>
                    {candidate.verification?.status || 'Not Verified'}
                  </Badge>
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>

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
