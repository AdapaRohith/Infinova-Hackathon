import { useMemo, useState } from 'react'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { CandidateTable } from '../components/CandidateTable'
import { ReportCard } from '../components/ReportCard'

export function DashboardPage({ candidates }) {
  const [minScore, setMinScore] = useState(0)
  const [maxScore, setMaxScore] = useState(100)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const filtered = useMemo(
    () =>
      candidates.filter((candidate) => {
        const score = candidate.analysis?.score ?? 0
        const verified = candidate.verification?.status === 'Verified on-chain'

        return (
          score >= Number(minScore) &&
          score <= Number(maxScore) &&
          (!verifiedOnly || verified)
        )
      }),
    [candidates, maxScore, minScore, verifiedOnly],
  )

  const stats = useMemo(() => {
    const verified = candidates.filter(
      (candidate) => candidate.verification?.status === 'Verified on-chain',
    ).length
    const avgScore = candidates.length
      ? Math.round(
          candidates.reduce((total, candidate) => total + (candidate.analysis?.score ?? 0), 0) /
            candidates.length,
        )
      : 0

    return {
      total: candidates.length,
      verified,
      avgScore,
    }
  }, [candidates])

  return (
    <div className="space-y-6 pb-14">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Total Candidates</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-100">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Verified On-chain</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-300">{stats.verified}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Average Score</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-100">{stats.avgScore}</p>
        </Card>
      </div>

      <Card>
        <h1 className="text-2xl font-semibold text-zinc-100">Recruiter Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-400">Filter and review candidate verification status at a glance.</p>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <Input
            label="Min Score"
            type="number"
            value={minScore}
            onChange={(event) => setMinScore(event.target.value)}
          />
          <Input
            label="Max Score"
            type="number"
            value={maxScore}
            onChange={(event) => setMaxScore(event.target.value)}
          />
          <label className="flex items-end gap-3 rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-300 md:col-span-2">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(event) => setVerifiedOnly(event.target.checked)}
              className="size-4 rounded"
            />
            Verified only
          </label>
        </div>
      </Card>

      <CandidateTable candidates={filtered} onViewReport={setSelectedCandidate} />

      <Modal
        open={Boolean(selectedCandidate)}
        title="Candidate Report"
        onClose={() => setSelectedCandidate(null)}
      >
        <ReportCard candidate={selectedCandidate} />
      </Modal>
    </div>
  )
}
