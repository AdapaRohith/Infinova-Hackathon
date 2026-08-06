import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Card } from '../components/ui/Card'
import { Input, fieldClasses } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { CandidateTable } from '../components/CandidateTable'
import { ReportCard } from '../components/ReportCard'
import { Button } from '../components/ui/Button'

const DEFAULT_MIN = 0
const DEFAULT_MAX = 100

/** Blank / non-numeric input must not silently filter every candidate out. */
const toBound = (value, fallback) => {
  const parsed = Number(value)
  return value === '' || Number.isNaN(parsed) ? fallback : parsed
}

export function DashboardPage({ candidates, onClearCandidates }) {
  const [minScore, setMinScore] = useState(String(DEFAULT_MIN))
  const [maxScore, setMaxScore] = useState(String(DEFAULT_MAX))
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const handleClearDashboard = () => {
    setSelectedCandidate(null)
    onClearCandidates?.()
    toast.success('Dashboard cleared')
  }

  const handleResetFilters = () => {
    setMinScore(String(DEFAULT_MIN))
    setMaxScore(String(DEFAULT_MAX))
    setVerifiedOnly(false)
    setSelectedSkill('')
  }

  const availableSkills = useMemo(
    () =>
      [
        ...new Set(
          candidates.flatMap((candidate) => candidate.analysis?.skills || candidate.skills || []),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [candidates],
  )

  const filtered = useMemo(() => {
    const min = toBound(minScore, DEFAULT_MIN)
    const max = toBound(maxScore, DEFAULT_MAX)

    return candidates.filter((candidate) => {
      const score = candidate.analysis?.score ?? 0
      const verified = candidate.verification?.status?.startsWith('Verified')
      const matchedSkills = candidate.analysis?.skills || candidate.skills || []
      const matchesSkill = !selectedSkill || matchedSkills.includes(selectedSkill)

      return score >= min && score <= max && (!verifiedOnly || verified) && matchesSkill
    })
  }, [candidates, maxScore, minScore, selectedSkill, verifiedOnly])

  const stats = useMemo(() => {
    const verified = candidates.filter((candidate) =>
      candidate.verification?.status?.startsWith('Verified'),
    ).length
    const trusted = candidates.filter(
      (candidate) => candidate.analysis?.assessment?.verdict === 'Trusted',
    ).length
    const highRisk = candidates.filter(
      (candidate) => candidate.analysis?.assessment?.verdict === 'High Risk',
    ).length
    const avgScore = candidates.length
      ? Math.round(
          candidates.reduce((total, candidate) => total + (candidate.analysis?.score ?? 0), 0) /
            candidates.length,
        )
      : 0

    return [
      { label: 'Total Candidates', value: candidates.length, ink: 'text-ink-50' },
      { label: 'Verified On Algorand', value: verified, ink: 'text-state-ok' },
      { label: 'Average Score', value: avgScore, ink: 'text-ink-50' },
      { label: 'Trusted', value: trusted, ink: 'text-state-ok' },
      { label: 'High Risk', value: highRisk, ink: 'text-state-bad' },
    ]
  }, [candidates])

  const filtersActive =
    verifiedOnly ||
    Boolean(selectedSkill) ||
    toBound(minScore, DEFAULT_MIN) !== DEFAULT_MIN ||
    toBound(maxScore, DEFAULT_MAX) !== DEFAULT_MAX

  return (
    <div className="space-y-6 pb-14">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-xs uppercase tracking-wider text-ink-500">{stat.label}</p>
            <p className={`mt-2 text-2xl font-semibold ${stat.ink}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-ink-50">Recruiter Dashboard</h1>
            <p className="mt-2 text-sm text-ink-400">
              Filter and review candidate verification status at a glance.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleResetFilters}
              disabled={!filtersActive}
            >
              Reset Filters
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClearDashboard}
              disabled={!candidates.length}
            >
              Clear Dashboard
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input
            label="Min Score"
            type="number"
            min={0}
            max={100}
            value={minScore}
            onChange={(event) => setMinScore(event.target.value)}
          />
          <Input
            label="Max Score"
            type="number"
            min={0}
            max={100}
            value={maxScore}
            onChange={(event) => setMaxScore(event.target.value)}
          />
          <label className="flex flex-col gap-2 text-sm text-ink-300">
            <span className="font-medium text-ink-200">Matched Skill</span>
            <select
              value={selectedSkill}
              onChange={(event) => setSelectedSkill(event.target.value)}
              className={fieldClasses}
            >
              <option value="">All skills</option>
              {availableSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-ink-700 bg-ink-950 px-4 py-3 text-sm text-ink-300 transition-colors hover:border-ink-600">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(event) => setVerifiedOnly(event.target.checked)}
              className="size-4 accent-ink-100"
            />
            Verified only
          </label>
        </div>

        <p className="mt-4 text-xs text-ink-500">
          Showing {filtered.length} of {candidates.length} candidate
          {candidates.length === 1 ? '' : 's'}.
        </p>
      </Card>

      {candidates.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-ink-200">No candidates have been analyzed yet.</p>
          <p className="mt-2 text-xs text-ink-500">
            Run an analysis to populate the dashboard and enable on-chain proofs.
          </p>
          <Link to="/analyze" className="mt-5 inline-block">
            <Button type="button">Analyze a Candidate</Button>
          </Link>
        </Card>
      ) : (
        <CandidateTable candidates={filtered} onViewReport={setSelectedCandidate} />
      )}

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
