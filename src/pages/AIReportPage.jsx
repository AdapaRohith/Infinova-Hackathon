import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { CheckCircle2, Copy, LoaderCircle, ShieldAlert, XCircle } from 'lucide-react'
import { FlowStepper } from '../components/FlowStepper'
import { BlockchainProofCard } from '../components/BlockchainProofCard'
import { ReportCard } from '../components/ReportCard'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Loader } from '../components/ui/Loader'
import { formatDateTime } from '../utils/helpers'

export function AIReportPage({ candidates, onGenerateProof }) {
  const { candidateId } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [txHash, setTxHash] = useState('')
  const [txStatus, setTxStatus] = useState('idle')
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

  const shortenHash = (value) => {
    if (!value) return '—'
    if (value.length <= 20) return value
    return `${value.slice(0, 10)}...${value.slice(-8)}`
  }

  const activeTxHash = txHash || candidate.verification?.txHash

  const proofStatus =
    txStatus === 'failed'
      ? 'tampered'
      : candidate.verification?.status === 'Verified on-chain'
        ? 'verified'
        : isLoading || txStatus === 'pending' || txStatus === 'waiting_approval'
          ? 'pending'
          : 'pending'

  const handleProof = async () => {
    setIsLoading(true)
    setStatusMessage('Waiting for MetaMask approval...')
    setTxStatus('waiting_approval')
    setTxHash('')

    try {
      const proof = await onGenerateProof(candidate.id, (state) => {
        setStatusMessage(state.message)
        setTxStatus(state.status)

        if (state.txHash) {
          setTxHash(state.txHash)
        }
      })

      if (proof?.txHash) {
        setTxHash(proof.txHash)
      }

      setStatusMessage('Transaction confirmed ✅')
      setTxStatus('confirmed')
      setRevealTick((value) => value + 1)
      toast.success('Blockchain proof generated')
    } catch (error) {
      const errorCode = error?.code
      let failureMessage = 'Transaction failed ❌'

      if (errorCode === 'NO_METAMASK') {
        failureMessage = 'MetaMask not installed. Install MetaMask to continue.'
      } else if (errorCode === 'WRONG_NETWORK') {
        failureMessage = 'Wrong network. Please switch MetaMask to Sepolia testnet.'
      } else if (errorCode === 4001) {
        failureMessage = 'Transaction failed ❌ User rejected in MetaMask.'
      }

      setStatusMessage(failureMessage)
      setTxStatus('failed')
      toast.error(failureMessage)
    } finally {
      setIsLoading(false)
    }
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

  const transactionSignal =
    txStatus === 'waiting_approval'
      ? {
          icon: <ShieldAlert className="size-4 text-amber-200" />,
          color: 'text-amber-200',
          border: 'border-amber-500/40 bg-amber-500/10',
        }
      : txStatus === 'pending'
        ? {
            icon: <LoaderCircle className="size-4 animate-spin text-indigo-200" />,
            color: 'text-indigo-200',
            border: 'border-indigo-500/40 bg-indigo-500/10',
          }
        : txStatus === 'confirmed'
          ? {
              icon: <CheckCircle2 className="size-4 text-emerald-300" />,
              color: 'text-emerald-300',
              border: 'border-emerald-500/40 bg-emerald-500/10 shadow-emerald-500/10',
            }
          : txStatus === 'failed'
            ? {
                icon: <XCircle className="size-4 text-red-300" />,
                color: 'text-red-300',
                border: 'border-red-500/40 bg-red-500/10',
              }
            : null

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
              disabled={isLoading}
              onClick={handleProof}
            >
              {isLoading
                ? 'Processing transaction...'
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

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-gray-950/70 px-3 py-2 text-xs text-gray-300">
            <p className="font-semibold text-indigo-300">Step 1: Generate AI Report</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-950/70 px-3 py-2 text-xs text-gray-300">
            <p className="font-semibold text-indigo-300">Step 2: Store Proof on Blockchain</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-950/70 px-3 py-2 text-xs text-gray-300">
            <p className="font-semibold text-indigo-300">Step 3: Verify Integrity</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-dashed border-indigo-500/40 bg-indigo-500/5 p-3 text-sm text-indigo-100/90">
          <p>Try modifying the data below to simulate tampering 👇</p>
          <p className="mt-1">Now click verify to check integrity.</p>
        </div>

        {transactionSignal ? (
          <Motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${transactionSignal.border} ${transactionSignal.color}`}
          >
            {transactionSignal.icon}
            <span>{statusMessage}</span>
          </Motion.div>
        ) : null}

        <AnimatePresence mode="wait">
          {isLoading ? (
            <Motion.div
              key="proof-loading"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-5 rounded-2xl border border-gray-800 bg-gray-950/70 p-5"
            >
              <Loader label={statusMessage || 'Processing blockchain transaction...'} />
            </Motion.div>
          ) : (
            <Motion.div
              key={`proof-ready-${revealTick}`}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="mt-5"
            >
              <BlockchainProofCard
                candidateId={candidate.id}
                hash={candidate.verification?.hash}
                txHash={activeTxHash}
                timestamp={candidate.verification?.timestamp}
                status={proofStatus}
                statusMessage={statusMessage}
                onCopyHash={handleCopyHash}
                copied={copied}
                agentSignature={candidate.analysis.agentSignature}
              />


              {candidate.verification?.history?.length > 1 ? (
                <div className="mt-4 rounded-2xl border border-gray-800 bg-gray-950 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Version History</p>
                  <div className="mt-2 space-y-1 text-xs text-gray-300">
                    {candidate.verification.history
                      .slice()
                      .reverse()
                      .slice(0, 5)
                      .map((item) => (
                        <p key={`${item.timestamp}-${item.hash}`}>• {shortenHash(item.hash)} · {formatDateTime(item.timestamp)}</p>
                      ))}
                  </div>
                </div>
              ) : null}
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
            <p className="mt-1 text-xs text-gray-400">Tamper-proof hash is available for recruiter verification. Timestamp: {formatDateTime(candidate.verification?.timestamp)}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
