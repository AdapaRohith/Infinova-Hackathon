import { useMemo, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CheckCircle2, CloudOff, ShieldAlert, ShieldCheck } from 'lucide-react'
import { FlowStepper } from '../components/FlowStepper'
import { ServiceUnavailableError } from '../utils/serviceStatus'

import { Card } from '../components/ui/Card'
import { Input, fieldClasses } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { Loader } from '../components/ui/Loader'
import { ScoreBar } from '../components/ScoreBar'
import { IdentityAlert } from '../components/IdentityAlert'

const initialForm = {
  name: '',
  email: '',
  link: '',
  resumeName: '',
  resumeFile: null,
}

const STRONG_GITHUB = 'STRONG'

export function CandidateAnalysisPage({ candidates = [], onAnalyzeCandidate, onGenerateProof }) {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [proofLoading, setProofLoading] = useState(false)
  const [analyzedId, setAnalyzedId] = useState(null)
  const [serviceFailure, setServiceFailure] = useState(null)
  const navigate = useNavigate()

  // Read back from the shared store so proof status stays in sync with the
  // background Algorand confirmation polling that App drives.
  const result = useMemo(
    () => candidates.find((candidate) => candidate.id === analyzedId) ?? null,
    [analyzedId, candidates],
  )

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.email || !form.link) {
      toast.error('Please complete required fields')
      return
    }

    setLoading(true)
    setAnalyzedId(null)
    setServiceFailure(null)

    try {
      const candidate = await onAnalyzeCandidate(form)
      setAnalyzedId(candidate.id)
      toast.success('AI analysis complete')
    } catch (error) {
      // An outage is a backend condition, not a candidate outcome. Surface it as
      // a persistent panel so it can never be mistaken for a low score.
      if (error instanceof ServiceUnavailableError) {
        setServiceFailure({ message: error.message, isOutage: error.isOutage })
        toast.error(error.isOutage ? 'Analysis service is offline' : 'Analysis service error')
        return
      }

      setServiceFailure({
        message: error?.message || 'The analysis could not be completed.',
        isOutage: false,
      })
      toast.error('Real AI analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateProof = async () => {
    if (!result) return

    setProofLoading(true)

    try {
      // App's reducer owns the verification record — no local copy to keep in sync.
      const proof = await onGenerateProof?.(result.id)
      if (proof) {
        toast.success(proof.confirmed ? 'Blockchain proof confirmed' : 'Blockchain proof submitted')
      }
    } catch (error) {
      toast.error(error?.message || 'Blockchain proof generation failed.')
    } finally {
      setProofLoading(false)
    }
  }

  const analysis = result?.analysis
  const githubVerification = analysis?.githubVerification
  const githubPassed = githubVerification?.status === STRONG_GITHUB

  return (
    <div className="space-y-6 pb-14">
      <FlowStepper currentStep={2} />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <h1 className="text-2xl font-semibold text-ink-50">Candidate Analysis</h1>
          <p className="mt-2 text-sm text-ink-400">
            Run AI skill verification and generate a trusted candidate profile.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Name"
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              placeholder="Avery Quinn"
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              placeholder="avery@candidate.dev"
              required
            />
            <label className="flex flex-col gap-2 text-sm text-ink-300">
              <span className="font-medium text-ink-200">Resume Upload</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null
                  handleChange('resumeFile', file)
                  handleChange('resumeName', file?.name || '')
                }}
                className={`${fieldClasses} py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-ink-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ink-100 hover:file:bg-ink-700`}
              />
              <span className="text-xs text-ink-500">
                {form.resumeName
                  ? `Selected: ${form.resumeName}`
                  : 'Optional, but identity checks are far stronger with a resume.'}
              </span>
            </label>
            <Input
              label="GitHub / Portfolio"
              value={form.link}
              onChange={(event) => handleChange('link', event.target.value)}
              placeholder="https://github.com/avery"
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Analyzing with AI...' : 'Analyze with AI'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={loading}
              onClick={() => {
                setForm(initialForm)
                setAnalyzedId(null)
                setServiceFailure(null)
              }}
            >
              Clear Form
            </Button>
          </form>
        </Card>

        <Card className="lg:col-span-3">
          <h2 className="text-xl font-semibold text-ink-50">AI Output</h2>
          <p className="mt-1 text-sm text-ink-400">AI insights fetched from your n8n workflow.</p>

          <AnimatePresence mode="wait">
            {loading ? (
              <Motion.div
                key="loading"
                className="mt-6 space-y-4"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <Loader label="Analyzing candidate resume..." />
                <Loader label="Verifying code repositories..." />
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-20 w-full" />
              </Motion.div>
            ) : null}

            {!loading && serviceFailure ? (
              <Motion.div
                key="service-failure"
                className="mt-6 rounded-xl border border-ink-700 bg-ink-950 p-5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="flex items-center gap-2 text-sm font-semibold text-state-warn">
                  <CloudOff className="size-4" />
                  {serviceFailure.isOutage ? 'Analysis service offline' : 'Analysis service error'}
                </p>
                <p className="mt-2 text-sm text-ink-300">{serviceFailure.message}</p>
                <p className="mt-3 text-xs text-ink-500">
                  No candidate was scored or stored. Nothing here reflects on this candidate — retry
                  once the workflow is reachable.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  Retry Analysis
                </Button>
              </Motion.div>
            ) : null}

            {!loading && !serviceFailure && result ? (
              <Motion.div
                key="result"
                className="mt-6 space-y-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="flex items-center gap-1.5 text-sm font-medium text-state-ok">
                      <CheckCircle2 className="size-4" /> AI Evaluation Complete
                    </p>
                    {githubVerification ? (
                      <p
                        className={`flex items-center gap-1 text-[11px] font-medium ${
                          githubPassed ? 'text-state-ok' : 'text-state-warn'
                        }`}
                      >
                        {githubPassed ? (
                          <ShieldCheck className="size-3" />
                        ) : (
                          <ShieldAlert className="size-3" />
                        )}
                        {githubPassed
                          ? 'Autonomous GitHub verification: pass'
                          : 'GitHub verification: manual review suggested'}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(analysis?.skills || result.skills || []).slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-ink-700 bg-ink-900 px-1.5 py-0.5 text-[10px] text-ink-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <ScoreBar score={analysis?.score} />

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-ink-800 bg-ink-950 p-4">
                    <p className="text-sm font-semibold text-ink-50">Strengths</p>
                    <p className="mt-2 text-sm text-ink-300">
                      {analysis?.strengths?.length ? analysis.strengths.join(', ') : 'None reported'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-ink-800 bg-ink-950 p-4">
                    <p className="text-sm font-semibold text-ink-50">Weaknesses</p>
                    <p className="mt-2 text-sm text-ink-300">
                      {analysis?.weaknesses?.length ? analysis.weaknesses.join(', ') : 'None reported'}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-ink-800 bg-ink-950 p-4">
                  <p className="text-sm font-semibold text-ink-50">AI Summary</p>
                  <p className="mt-2 line-clamp-3 text-sm text-ink-300">{analysis?.summary}</p>
                </div>

                {analysis?.assessment ? (
                  <div className="grid gap-3 md:grid-cols-3">
                    {[
                      { label: 'Verdict', value: analysis.assessment.verdict },
                      { label: 'Risk', value: analysis.assessment.riskLevel },
                      { label: 'Confidence', value: analysis.assessment.confidence },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-ink-800 bg-ink-950 p-4">
                        <p className="text-[11px] uppercase tracking-wide text-ink-500">{item.label}</p>
                        <p className="mt-2 text-lg font-semibold text-ink-50">{item.value}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <IdentityAlert identityCheck={analysis?.identityCheck} />

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => navigate(`/report/${result.id}`)}
                  >
                    Open AI Report
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={proofLoading}
                    onClick={handleGenerateProof}
                  >
                    {proofLoading
                      ? 'Generating Proof...'
                      : result.verification?.status
                        ? 'Regenerate Proof'
                        : 'Generate Proof'}
                  </Button>
                </div>

                {result.verification?.status ? (
                  <p className="text-xs text-ink-500">
                    Current proof status: {result.verification.status}
                  </p>
                ) : null}
              </Motion.div>
            ) : null}

            {!loading && !result && !serviceFailure ? (
              <Motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 rounded-xl border border-dashed border-ink-700 p-6 text-sm text-ink-400"
              >
                Submit a candidate to fetch real AI analysis from n8n.
              </Motion.div>
            ) : null}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  )
}
