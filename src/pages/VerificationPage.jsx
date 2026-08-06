import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ExternalLink } from 'lucide-react'
import { FlowStepper } from '../components/FlowStepper'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { formatDateTime } from '../utils/helpers'
import {
  blockchainNetworkName,
  blockchainNetworkLabel,
  attestationReferenceLabel,
  attestationReferenceValue,
  contractExplorerUrl,
  getLatestAttestation,
  getTxExplorerUrl,
  verifyHash,
} from '../utils/blockchain'
import { VerificationResultBanner } from '../components/VerificationResultBanner'

const shortenHash = (value) => {
  if (!value) return '-'
  if (value.length <= 20) return value
  return `${value.slice(0, 10)}...${value.slice(-8)}`
}

const verifySteps = [
  'Step 1: Candidate Evaluated',
  'Step 2: Attestation Written on Algorand',
  'Step 3: Integrity Rechecked Independently',
]

function Tile({ label, children }) {
  return (
    <div className="rounded-xl border border-ink-800 bg-ink-950 p-4">
      <p className="text-[11px] uppercase tracking-wide text-ink-500">{label}</p>
      {children}
    </div>
  )
}

export function VerificationPage({ candidates }) {
  const [hash, setHash] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [verificationState, setVerificationState] = useState('idle')
  const [attestationMeta, setAttestationMeta] = useState(null)

  const verifiedCandidates = useMemo(
    () => candidates.filter((candidate) => candidate.verification?.hash).slice(0, 4),
    [candidates],
  )

  const resetOutcome = () => {
    setResult(null)
    setAttestationMeta(null)
  }

  const handleVerify = async (event) => {
    event.preventDefault()

    const trimmedHash = hash.trim()
    if (!trimmedHash) {
      toast.error('Paste an attestation hash first')
      return
    }

    setIsLoading(true)
    setVerificationState('pending')
    setError('')
    resetOutcome()

    const match = candidates.find(
      (candidate) => candidate.verification?.hash?.toLowerCase() === trimmedHash.toLowerCase(),
    )

    if (!match) {
      setError(
        'No matching attestation found for this hash in the current recruiter workspace. Verification runs against candidates stored in this browser.',
      )
      setVerificationState('notfound')
      setIsLoading(false)
      toast.error('Attestation hash not found')
      return
    }

    try {
      const attestationId = match.attestationId || match.id
      const [isValid, latestAttestation] = await Promise.all([
        verifyHash(attestationId, trimmedHash),
        getLatestAttestation(attestationId),
      ])

      if (!isValid) {
        resetOutcome()
        setError(
          'This hash exists in the local workspace but no matching record was found on Algorand. The report may have been altered, or the transaction is not indexed yet.',
        )
        setVerificationState('tampered')
        toast.error('Verification mismatch')
        return
      }

      setResult(match)
      setAttestationMeta(latestAttestation)
      setError('')
      setVerificationState('verified')
      toast.success('Attestation verified on Algorand')
    } catch {
      setError('Unable to reach Algorand verification services right now. Please try again.')
      setVerificationState('idle')
      resetOutcome()
      toast.error('Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const latestTimestamp =
    typeof attestationMeta?.timestamp === 'number'
      ? formatDateTime(new Date(attestationMeta.timestamp * 1000).toISOString())
      : formatDateTime(attestationMeta?.timestamp || result?.verification?.timestamp)

  const explorerTx = attestationMeta?.txHash || result?.verification?.txHash

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-14">
      <FlowStepper currentStep={4} />

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink-50">On-Chain Attestation Verifier</h1>
            <p className="mt-2 text-sm text-ink-400">
              Validate that a hiring report hash still matches the Algorand attestation.
            </p>
          </div>
          <div className="rounded-xl border border-ink-800 bg-ink-950 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-ink-500">Network</p>
            <p className="mt-1 font-medium text-ink-50">{blockchainNetworkLabel}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {verifySteps.map((step) => (
            <div
              key={step}
              className="rounded-xl border border-ink-800 bg-ink-950 px-3 py-2 text-xs font-medium text-ink-300"
            >
              {step}
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Tile label={attestationReferenceLabel}>
            <a
              href={contractExplorerUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-ink-200 transition-colors hover:text-ink-50"
            >
              <span className="font-mono">{attestationReferenceValue}</span>
              <ExternalLink className="size-3.5" />
            </a>
          </Tile>
          <Tile label="What Is Anchored">
            <p className="mt-2 text-sm text-ink-300">
              Candidate ID plus the final hiring report hash. Sensitive candidate content stays off-chain.
            </p>
          </Tile>
        </div>

        <form className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleVerify}>
          <Input
            wrapperClassName="sm:flex-1"
            label="Attestation hash"
            value={hash}
            onChange={(event) => setHash(event.target.value)}
            placeholder="Paste attestation hash"
            className="font-mono"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify on Algorand'}
          </Button>
        </form>

        {verifiedCandidates.length > 0 ? (
          <div className="mt-5">
            <p className="text-xs uppercase tracking-wider text-ink-500">Quick Demo Attestations</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {verifiedCandidates.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => setHash(candidate.verification.hash)}
                  className="rounded-xl border border-ink-800 bg-ink-950 px-3 py-2 text-left transition-colors hover:border-ink-500"
                >
                  <span className="block text-sm font-medium text-ink-50">{candidate.name}</span>
                  <span className="block font-mono text-xs text-ink-500">
                    {shortenHash(candidate.verification.hash)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-5 text-xs text-ink-500">
            No proofs generated yet.{' '}
            <Link to="/analyze" className="text-ink-200 underline underline-offset-4 hover:text-ink-50">
              Analyze a candidate
            </Link>{' '}
            and anchor a report to try the verifier.
          </p>
        )}
      </Card>

      <VerificationResultBanner status={verificationState} />

      {error ? (
        <Card>
          <p className="text-sm font-medium text-state-bad">Verification failed</p>
          <p className="mt-1 text-sm text-ink-300">{error}</p>
        </Card>
      ) : null}

      {result ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <p className="text-xs uppercase tracking-wider text-ink-500">Verified Candidate</p>
            <h2 className="mt-2 text-xl font-semibold text-ink-50">{result.name}</h2>
            <p className="text-sm text-ink-400">{result.email}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge tone="ok">{result.verification?.status || 'Verified on Algorand'}</Badge>
              <span className="text-sm text-ink-300">Score: {result.analysis?.score ?? 0}/100</span>
              <span className="text-sm text-ink-300">
                Timestamp: {formatDateTime(result.verification?.timestamp)}
              </span>
            </div>
            <div className="mt-4">
              <Tile label="Recruiter Verdict">
                <p className="mt-2 text-lg font-semibold text-ink-50">
                  {result.analysis?.assessment?.verdict || 'Verified'}
                </p>
                <p className="mt-1 text-sm text-ink-400">{result.analysis?.summary}</p>
              </Tile>
            </div>
            <Link to={`/report/${result.id}`} className="mt-4 inline-block">
              <Button type="button" variant="secondary">
                Open Full Report
              </Button>
            </Link>
          </Card>

          <Card>
            <p className="text-xs uppercase tracking-wider text-ink-500">Attestation Metadata</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Tile label="Candidate ID">
                <p className="mt-2 break-all font-mono text-sm text-ink-200">
                  {result.attestationId || result.id}
                </p>
              </Tile>
              <Tile label="On-Chain Versions">
                <p className="mt-2 text-lg font-semibold text-ink-50">{attestationMeta?.count ?? 1}</p>
              </Tile>
              <Tile label="Latest On-Chain Timestamp">
                <p className="mt-2 text-sm text-ink-200">{latestTimestamp}</p>
              </Tile>
              <Tile label="Transaction">
                {explorerTx ? (
                  <a
                    href={getTxExplorerUrl(explorerTx)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm text-ink-200 transition-colors hover:text-ink-50"
                  >
                    <span className="font-mono">{shortenHash(explorerTx)}</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-ink-500">Transaction ID unavailable</p>
                )}
              </Tile>
            </div>
            <div className="mt-4 rounded-xl border border-ink-800 bg-ink-950 p-4 text-sm text-ink-300">
              This attestation proves the hiring report hash currently matches the record stored on{' '}
              {blockchainNetworkName}.
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
