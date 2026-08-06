import { ExternalLink } from 'lucide-react'
import { Badge } from './ui/Badge'
import { Card } from './ui/Card'
import { ScoreBar } from './ScoreBar'
import { Timeline } from './Timeline'
import { IdentityAlert } from './IdentityAlert'

const toneInk = {
  positive: 'text-state-ok',
  caution: 'text-state-warn',
  negative: 'text-state-bad',
  complete: 'text-state-ok',
  warning: 'text-state-warn',
  alert: 'text-state-bad',
}

const toneBadge = {
  positive: 'ok',
  caution: 'warn',
  negative: 'bad',
}

const githubStatusLabel = (status) => {
  if (status === 'STRONG') return 'Claims Verified'
  if (status === 'WEAK') return 'False / Weak Claims'
  if (status === 'NO_LINK') return 'No Link Provided'
  if (['WEBHOOK_ERROR', 'EMPTY_RESPONSE', 'UNREACHABLE', 'UNAVAILABLE'].includes(status)) {
    return 'Service Unavailable'
  }
  return 'Manual Review'
}

const githubStatusTone = (status, score) => {
  if (status === 'STRONG') return 'positive'
  if (status === 'WEAK' || status === 'NO_LINK') return 'negative'
  return Number(score) >= 75 ? 'positive' : 'caution'
}

function Section({ title, children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-ink-800 bg-ink-950 p-4 ${className}`}>
      <p className="mb-3 text-sm font-semibold text-ink-50">{title}</p>
      {children}
    </div>
  )
}

function BulletList({ items, empty = 'Not specified' }) {
  if (!items?.length) {
    return <p className="text-sm text-ink-500">{empty}</p>
  }

  return (
    <ul className="space-y-1.5 text-sm text-ink-300">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-start gap-2">
          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-ink-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function ReportCard({ candidate }) {
  if (!candidate) return null

  const analysis = candidate.analysis ?? {}
  const assessment = analysis.assessment
  const skills = analysis.skills ?? candidate.skills ?? []
  const strengths = analysis.strengths ?? []
  const weaknesses = analysis.weaknesses ?? []
  const githubVerification = analysis.githubVerification
  const isVerified = Boolean(candidate.verification?.status?.startsWith('Verified'))

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <p className="text-xs uppercase tracking-wider text-ink-500">Candidate</p>
        <h3 className="mt-2 text-xl font-semibold text-ink-50">{candidate.name}</h3>
        <p className="mt-1 break-all text-sm text-ink-400">{candidate.email}</p>

        {candidate.link ? (
          <a
            href={candidate.link}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm text-ink-200 transition-colors hover:text-ink-50"
          >
            Portfolio / GitHub
            <ExternalLink className="size-3.5" />
          </a>
        ) : (
          <p className="mt-3 text-sm text-ink-500">No portfolio link provided</p>
        )}

        <div className="mt-4 space-y-2 border-t border-ink-800 pt-4 text-xs text-ink-500">
          <p>Resume: {candidate.resumeName || 'Not uploaded'}</p>
          <p className="break-all">Attestation ID: {candidate.attestationId || candidate.id}</p>
        </div>
      </Card>

      <Card className="space-y-4 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-wider text-ink-500">AI Evaluation</p>
          <Badge tone={isVerified ? 'ok' : 'neutral'}>
            {candidate.verification?.status || 'Not Verified'}
          </Badge>
        </div>

        {assessment ? (
          <div className="rounded-2xl border border-ink-800 bg-ink-950 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink-500">Recruiter Decision</p>
                <h4 className={`mt-2 text-2xl font-semibold ${toneInk[assessment.verdictTone] ?? 'text-ink-50'}`}>
                  {assessment.verdict}
                </h4>
                <p className="mt-1 text-sm text-ink-400">
                  Risk: {assessment.riskLevel} · Confidence: {assessment.confidence}
                </p>
              </div>
              <div className="rounded-xl border border-ink-800 bg-ink-900 px-3 py-2 text-right">
                <p className="text-[10px] uppercase tracking-wide text-ink-500">Trust Signal</p>
                <p className="mt-1 text-lg font-semibold text-ink-50">{analysis.score ?? 0}/100</p>
              </div>
            </div>
          </div>
        ) : null}

        <ScoreBar score={analysis.score} />

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-ink-200">Skills</p>
              {skills.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-ink-700 bg-ink-900 px-2 py-0.5 text-xs font-medium text-ink-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-500">No skills extracted</p>
              )}
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-ink-200">Experience</p>
              <p className="text-sm text-ink-400">{candidate.experience || 'Not specified'}</p>
              {candidate.yearsOfExperience > 0 ? (
                <p className="mt-1 text-xs text-ink-500">
                  {candidate.yearsOfExperience} total years detected
                </p>
              ) : null}
            </div>

            {candidate.education?.length ? (
              <div>
                <p className="mb-2 text-sm font-semibold text-ink-200">Education</p>
                <BulletList items={candidate.education} />
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-ink-200">Strengths</p>
              <BulletList items={strengths} empty="No strengths reported" />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-ink-200">Weaknesses</p>
              <BulletList items={weaknesses} empty="No weaknesses reported" />
            </div>
            {candidate.certifications?.length ? (
              <div>
                <p className="mb-2 text-sm font-semibold text-ink-200">Certifications</p>
                <BulletList items={candidate.certifications} />
              </div>
            ) : null}
          </div>
        </div>

        <Section title="AI Summary">
          <p className="text-sm leading-relaxed text-ink-300">
            {analysis.summary || 'No summary returned by the analysis service.'}
          </p>
        </Section>

        <IdentityAlert identityCheck={analysis.identityCheck} />

        {assessment?.evidence?.length ? (
          <Section title="Evidence Snapshot">
            <div className="grid gap-2 md:grid-cols-2">
              {assessment.evidence.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-2 rounded-xl border border-ink-800 bg-ink-925 px-3 py-3 text-sm text-ink-300"
                >
                  <span
                    className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                      item.tone === 'positive'
                        ? 'bg-state-ok'
                        : item.tone === 'negative'
                          ? 'bg-state-bad'
                          : 'bg-state-warn'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {githubVerification ? (
          <Section title="Autonomous Verification Agent">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge tone={toneBadge[githubStatusTone(githubVerification.status, githubVerification.score)]}>
                {githubStatusLabel(githubVerification.status)}
              </Badge>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wide text-ink-500">GitHub Audit Score</p>
                <p
                  className={`text-lg font-bold ${
                    toneInk[githubStatusTone(githubVerification.status, githubVerification.score)]
                  }`}
                >
                  {githubVerification.score ?? 0}/100
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm italic text-ink-300">“{githubVerification.details}”</p>
            {githubVerification.summary ? (
              <div className="mt-3 border-t border-ink-800 pt-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                  Audit Summary
                </p>
                <p className="text-sm leading-relaxed text-ink-400">{githubVerification.summary}</p>
              </div>
            ) : null}
          </Section>
        ) : null}

        {assessment?.agentTrace?.length ? (
          <Section title="Agent Trace">
            <div className="space-y-2">
              {assessment.agentTrace.map((step) => (
                <div key={step.agent} className="rounded-xl border border-ink-800 bg-ink-925 px-3 py-3">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-200">
                    <span
                      className={`size-1.5 rounded-full ${
                        step.status === 'complete'
                          ? 'bg-state-ok'
                          : step.status === 'alert'
                            ? 'bg-state-bad'
                            : 'bg-state-warn'
                      }`}
                    />
                    {step.agent}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{step.summary}</p>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {analysis.agentSignature ? (
          <Section title="AI Agent Digital Signature">
            <p className="break-all font-mono text-[10px] text-ink-500">{analysis.agentSignature}</p>
          </Section>
        ) : null}

        <Section title="Verification Timeline">
          <Timeline candidate={candidate} />
        </Section>
      </Card>
    </div>
  )
}
