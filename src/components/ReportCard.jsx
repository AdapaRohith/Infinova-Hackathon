import { Badge } from './ui/Badge'
import { Card } from './ui/Card'
import { ScoreBar } from './ScoreBar'
import { Timeline } from './Timeline'

export function ReportCard({ candidate }) {
  if (!candidate) return null

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <p className="text-xs uppercase tracking-wide text-gray-400">Candidate</p>
        <h3 className="mt-2 text-xl font-semibold text-white">{candidate.name}</h3>
        <p className="mt-1 text-sm text-gray-400">{candidate.email}</p>
        <a href={candidate.link} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-gray-300 underline-offset-4 hover:underline">
          Portfolio / GitHub
        </a>
        <p className="mt-3 text-xs text-gray-500">Resume: {candidate.resumeName || 'Uploaded file'}</p>
      </Card>

      <Card className="space-y-4 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-wide text-gray-400">AI Evaluation</p>
          <Badge success={candidate.verification?.status === 'Verified on-chain'}>
            {candidate.verification?.status || 'Not Verified'}
          </Badge>
        </div>
        <ScoreBar score={candidate.analysis.score} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-200">Strengths</p>
            <ul className="space-y-1 text-sm text-gray-400">
              {candidate.analysis.strengths.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-200">Weaknesses</p>
            <ul className="space-y-1 text-sm text-gray-400">
              {candidate.analysis.weaknesses.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm text-gray-300">{candidate.analysis.summary}</p>
        <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
          <p className="mb-3 text-sm font-semibold text-gray-200">Verification Timeline</p>
          <Timeline candidate={candidate} />
        </div>
      </Card>
    </div>
  )
}
