import { useState } from 'react'
import toast from 'react-hot-toast'
import { FlowStepper } from '../components/FlowStepper'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { formatDateTime } from '../utils/helpers'
import { verifyHash } from '../utils/blockchain'
import { VerificationResultBanner } from '../components/VerificationResultBanner'

export function VerificationPage({ candidates }) {
  const [hash, setHash] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [verificationState, setVerificationState] = useState('idle')

  const handleVerify = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setVerificationState('pending')

    const match = candidates.find(
      (candidate) => candidate.verification?.hash?.toLowerCase() === hash.trim().toLowerCase(),
    )

    if (!match) {
      setResult(null)
      setError('No matching candidate found for this hash')
      setVerificationState('tampered')
      setIsLoading(false)
      toast.error('Hash not found')
      return
    }

    try {
      const isValid = await verifyHash(match.id, hash.trim())

      if (!isValid) {
        setResult(null)
        setError('Hash exists locally but failed on-chain verification.')
        setVerificationState('tampered')
        toast.error('Verification mismatch ❌')
        return
      }

      setResult(match)
      setError('')
      setVerificationState('verified')
      toast.success('Verification matched ✅')
    } catch (blockchainError) {
      if (blockchainError?.code === 'NO_METAMASK') {
        setError('MetaMask is not installed. Please install it to verify on-chain.')
      } else if (blockchainError?.code === 'WRONG_NETWORK') {
        setError('Wrong network. Switch to Sepolia testnet to verify this hash.')
      } else {
        setError('Unable to verify on-chain right now. Please try again.')
      }

      setVerificationState('tampered')
      setResult(null)
      toast.error('Verification failed ❌')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-14">
      <FlowStepper currentStep={4} />

      <Card>
        <h1 className="text-2xl font-semibold text-white">Verification</h1>
        <p className="mt-2 text-sm text-gray-400">Enter a proof hash to validate candidate authenticity.</p>

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

        <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleVerify}>
          <Input
            className="sm:flex-1"
            value={hash}
            onChange={(event) => setHash(event.target.value)}
            placeholder="0x..."
          />
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Verifying...' : 'Verify Hash'}</Button>
        </form>
      </Card>

      <VerificationResultBanner status={verificationState} />

      {error ? (
        <Card className="border-red-500/30 bg-red-500/10">
          <p className="text-sm font-medium text-red-300">Verification failed</p>
          <p className="mt-1 text-sm text-red-200/90">{error}</p>
        </Card>
      ) : null}

      {result ? (
        <Card>
          <p className="text-xs uppercase tracking-wide text-gray-400">Candidate details</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{result.name}</h2>
          <p className="text-sm text-gray-400">{result.email}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge success>{result.verification?.status || 'Verified on-chain'}</Badge>
            <span className="text-sm text-gray-300">Score: {result.analysis?.score}/100</span>
            <span className="text-sm text-gray-300">Timestamp: {formatDateTime(result.verification?.timestamp)}</span>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
