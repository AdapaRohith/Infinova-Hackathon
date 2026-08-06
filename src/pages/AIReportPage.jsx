import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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
import { disconnectWalletSession } from '../utils/blockchain'

const shortenHash = (value) => {
  if (!value) return '-'
  if (value.length <= 20) return value
  return `${value.slice(0, 10)}...${value.slice(-8)}`
}

const proofSteps = [
  'Step 1: Generate AI Report',
  'Step 2: Store Proof on Algorand',
  'Step 3: Verify Integrity',
]

export function AIReportPage({ candidates, onGenerateProof, onRefreshProofStatus }) {
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
  const verification = candidate?.verification

  const activeTxHash =
    txHash || verification?.txHash || verification?.history?.slice(-1)[0]?.txHash || ''

  useEffect(() => {
    if (!verification) return

    if (verification.status === 'Verified on Algorand') {
      setTxStatus('confirmed')
      setStatusMessage('Algorand attestation confirmed.')
      return
    }

    if (verification.status === 'Pending on Algorand') {
      setTxStatus('pending')
      setStatusMessage('Transaction submitted to Algorand. Waiting for network confirmation...')
    }
  }, [verification])

  useEffect(() => {
    if (activeTxHash && !txHash) {
      setTxHash(activeTxHash)
    }
  }, [activeTxHash, txHash])

  useEffect(() => {
    if (!candidate || verification?.status !== 'Pending on Algorand' || !activeTxHash) return undefined

    let cancelled = false
    const intervalId = window.setInterval(async () => {
      const confirmed = await onRefreshProofStatus?.(candidate.id)
      if (!cancelled && confirmed) {
        setStatusMessage('Algorand attestation confirmed.')
        setTxStatus('confirmed')
      }
    }, 10000)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [activeTxHash, candidate, onRefreshProofStatus, verification?.status])

  // `idle` keeps the proof card honest before anything has been anchored.
  const proofStatus = (() => {
    if (txStatus === 'failed') return 'tampered'
    if (verification?.status === 'Verified on Algorand' || txStatus === 'confirmed') return 'verified'
    if (
      verification?.status === 'Pending on Algorand' ||
      isLoading ||
      txStatus === 'waiting_approval' ||
      txStatus === 'pending'
    ) {
      return 'pending'
    }
    return 'idle'
  })()

  const handleProof = async () => {
    if (!candidate) return

    setIsLoading(true)
    setStatusMessage('Waiting for Pera Wallet approval...')
    setTxStatus('waiting_approval')
    setTxHash('')

    try {
      const proof = await onGenerateProof(candidate.id, (state) => {
        setStatusMessage(state.message)
        setTxStatus(state.status)
        if (state.txHash) setTxHash(state.txHash)
      })

      if (proof?.txHash) setTxHash(proof.txHash)

      if (proof?.confirmed) {
        setStatusMessage('Algorand attestation confirmed.')
        setTxStatus('confirmed')
        toast.success('Blockchain proof confirmed')
      } else {
        setStatusMessage('Transaction submitted to Algorand. Waiting for network confirmation...')
        setTxStatus('pending')
        toast.success('Blockchain proof submitted')
      }
      setRevealTick((value) => value + 1)
    } catch (error) {
      const errorCode = error?.code
      let failureMessage = 'Transaction failed.'

      if (errorCode === 'NO_PERA') {
        failureMessage = error?.message || 'Pera Wallet is required to continue.'
      } else if (errorCode === 'NO_ACCOUNT') {
        failureMessage = 'No Algorand account is available in Pera Wallet.'
      } else if (errorCode === 'WALLET_REJECTED' || errorCode === 4001) {
        failureMessage = 'Transaction failed. User rejected the Pera Wallet request.'
      } else if (error?.message) {
        failureMessage = error.message
      }

      setStatusMessage(failureMessage)
      setTxStatus('failed')
      toast.error(failureMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyHash = useCallback(async () => {
    if (!verification?.hash) {
      toast.error('Generate proof before copying hash')
      return
    }

    try {
      await navigator.clipboard.writeText(verification.hash)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
      toast.success('Hash copied to clipboard')
    } catch {
      toast.error('Clipboard access is blocked on this browser')
    }
  }, [verification?.hash])

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWalletSession()
      setStatusMessage('Pera Wallet session disconnected. You can connect again when ready.')
      setTxStatus('idle')
      setTxHash('')
      toast.success('Pera Wallet disconnected')
    } catch {
      toast.error('Could not disconnect Pera Wallet session')
    }
  }

  const transactionSignal =
    txStatus === 'waiting_approval'
      ? { icon: <ShieldAlert className="size-4 text-state-warn" />, ink: 'text-state-warn' }
      : txStatus === 'pending'
        ? { icon: <LoaderCircle className="size-4 animate-spin text-ink-300" />, ink: 'text-ink-200' }
        : txStatus === 'confirmed'
          ? { icon: <CheckCircle2 className="size-4 text-state-ok" />, ink: 'text-state-ok' }
          : txStatus === 'failed'
            ? { icon: <XCircle className="size-4 text-state-bad" />, ink: 'text-state-bad' }
            : null

  if (!candidate) {
    return (
      <Card className="mx-auto max-w-2xl text-center">
        <p className="text-lg font-semibold text-ink-50">Candidate report not found</p>
        <p className="mt-2 text-sm text-ink-400">
          This report is not in the current recruiter workspace. It may have been cleared from the
          dashboard.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/dashboard">
            <Button type="button">Back to Dashboard</Button>
          </Link>
          <Link to="/analyze">
            <Button type="button" variant="outline">
              Analyze a Candidate
            </Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6 pb-14">
      <FlowStepper currentStep={3} />

      <ReportCard candidate={candidate} />

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-ink-50">Blockchain Verification Module</h2>
            <p className="mt-1 text-sm text-ink-400">
              Create an immutable Algorand proof for this AI report.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled={isLoading} onClick={handleProof}>
              {isLoading
                ? 'Processing transaction...'
                : verification?.status
                  ? 'Regenerate Proof'
                  : 'Generate Proof'}
            </Button>
            <Button type="button" variant="secondary" disabled={isLoading} onClick={handleDisconnectWallet}>
              Disconnect Pera
            </Button>

            <div className="relative">
              <Button type="button" variant="secondary" onClick={handleCopyHash} disabled={!verification?.hash}>
                <Copy className="size-4" />
                Copy Hash
              </Button>
              <AnimatePresence>
                {copied ? (
                  <Motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md border border-ink-700 bg-ink-900 px-2 py-1 text-xs text-ink-100"
                  >
                    Copied
                  </Motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {proofSteps.map((step) => (
            <div
              key={step}
              className="rounded-xl border border-ink-800 bg-ink-950 px-3 py-2 text-xs font-medium text-ink-300"
            >
              {step}
            </div>
          ))}
        </div>

        {transactionSignal ? (
          <Motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            aria-live="polite"
            className={`mt-4 flex items-center gap-2 rounded-xl border border-ink-800 bg-ink-950 px-3 py-2 text-sm ${transactionSignal.ink}`}
          >
            {transactionSignal.icon}
            <span>{statusMessage}</span>
          </Motion.div>
        ) : null}

        <AnimatePresence mode="wait">
          {isLoading ? (
            <Motion.div
              key="proof-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-5 rounded-2xl border border-ink-800 bg-ink-950 p-5"
            >
              <Loader label={statusMessage || 'Processing Algorand transaction...'} />
            </Motion.div>
          ) : (
            <Motion.div
              key={`proof-ready-${revealTick}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-5"
            >
              <BlockchainProofCard
                candidateId={candidate.attestationId || candidate.id}
                hash={verification?.hash}
                txHash={activeTxHash}
                timestamp={verification?.timestamp}
                status={proofStatus}
                statusMessage={statusMessage}
                onCopyHash={handleCopyHash}
                copied={copied}
                agentSignature={candidate.analysis?.agentSignature}
              />

              {verification?.history?.length > 1 ? (
                <div className="mt-4 rounded-2xl border border-ink-800 bg-ink-950 p-4">
                  <p className="text-xs uppercase tracking-wider text-ink-500">Version History</p>
                  <div className="mt-2 space-y-1 font-mono text-xs text-ink-300">
                    {verification.history
                      .slice()
                      .reverse()
                      .slice(0, 5)
                      .map((item) => (
                        <p key={`${item.timestamp}-${item.hash}`}>
                          {shortenHash(item.hash)} · {formatDateTime(item.timestamp)}
                        </p>
                      ))}
                  </div>
                </div>
              ) : null}
            </Motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <div className="rounded-xl border border-ink-800 bg-ink-950 p-3">
            <p className="text-sm font-medium text-state-ok">AI Evaluation Complete</p>
            <p className="mt-1 text-xs text-ink-500">Candidate signals and skill score generated.</p>
          </div>
          <div className="rounded-xl border border-ink-800 bg-ink-950 p-3">
            <p
              className={`text-sm font-medium ${
                verification?.status === 'Verified on Algorand' ? 'text-state-ok' : 'text-ink-300'
              }`}
            >
              {verification?.status === 'Verified on Algorand'
                ? 'Proof Stored on Algorand'
                : verification?.status === 'Pending on Algorand'
                  ? 'Proof Awaiting Confirmation'
                  : 'Proof Not Yet Stored'}
            </p>
            <p className="mt-1 text-xs text-ink-500">
              {verification?.status === 'Verified on Algorand'
                ? `Tamper-proof hash confirmed. Timestamp: ${formatDateTime(verification.timestamp)}`
                : verification?.status === 'Pending on Algorand'
                  ? 'Transaction submitted to Algorand and awaiting confirmation.'
                  : 'Generate a proof to anchor this report on Algorand.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
