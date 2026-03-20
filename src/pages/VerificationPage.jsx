import { useState } from 'react'
import toast from 'react-hot-toast'
import { FlowStepper } from '../components/FlowStepper'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { formatDateTime } from '../utils/helpers'

export function VerificationPage({ candidates }) {
  const [hash, setHash] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleVerify = (event) => {
    event.preventDefault()

    const match = candidates.find(
      (candidate) => candidate.verification?.hash?.toLowerCase() === hash.trim().toLowerCase(),
    )

    if (!match) {
      setResult(null)
      setError('No matching candidate found for this hash')
      toast.error('Hash not found')
      return
    }

    setResult(match)
    setError('')
    toast.success('Verification matched')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-14">
      <FlowStepper currentStep={4} />

      <Card>
        <h1 className="text-2xl font-semibold text-white">Verification</h1>
        <p className="mt-2 text-sm text-gray-400">Enter a proof hash to validate candidate authenticity.</p>

        <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleVerify}>
          <Input
            className="sm:flex-1"
            value={hash}
            onChange={(event) => setHash(event.target.value)}
            placeholder="0x..."
          />
          <Button type="submit">Verify Hash</Button>
        </form>
      </Card>

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
            <Badge success>{result.verification?.status}</Badge>
            <span className="text-sm text-gray-300">Score: {result.analysis?.score}/100</span>
            <span className="text-sm text-gray-300">Timestamp: {formatDateTime(result.verification?.timestamp)}</span>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
