import { useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FlowStepper } from '../components/FlowStepper'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { Loader } from '../components/ui/Loader'
import { ScoreBar } from '../components/ScoreBar'

const initialForm = {
  name: '',
  email: '',
  link: '',
  resumeName: '',
  resumeFile: null,
}

export function CandidateAnalysisPage({ onAnalyzeCandidate }) {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const navigate = useNavigate()

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.email || !form.link || !form.resumeFile) {
      toast.error('Please complete required fields and upload a resume')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const candidate = await onAnalyzeCandidate(form)
      setResult(candidate)
      toast.success('AI analysis complete')
    } catch (err) {
      console.error(err)
      toast.error('Analysis failed – please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-14">
      <FlowStepper currentStep={2} />

      <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <h1 className="text-2xl font-semibold text-white">Candidate Analysis</h1>
        <p className="mt-2 text-sm text-gray-400">Run AI skill verification and generate a trusted candidate profile.</p>

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
          <label className="flex flex-col gap-2 text-sm text-gray-300">
            <span>Resume Upload</span>
            <input
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  handleChange('resumeName', file.name)
                  handleChange('resumeFile', file)
                }
              }}
              className="rounded-2xl border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-gray-300"
            />
          </label>
          <Input
            label="GitHub / Portfolio"
            value={form.link}
            onChange={(event) => handleChange('link', event.target.value)}
            placeholder="https://github.com/avery"
            required
          />
          <Button className="w-full" disabled={loading}>
            {loading ? 'Analyzing with AI...' : 'Analyze with AI'}
          </Button>

        </form>
      </Card>

      <Card className="lg:col-span-3">
        <h2 className="text-xl font-semibold text-white">AI Output</h2>
        <p className="mt-1 text-sm text-gray-400">Simulated skill intelligence based on submitted profile.</p>

        <AnimatePresence mode="wait">
          {loading ? (
            <Motion.div
              key="loading"
              className="mt-6 space-y-3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <Loader label="Analyzing candidate with AI..." />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-20 w-full" />
            </Motion.div>
          ) : null}

          {!loading && result ? (
            <Motion.div
              key="result"
              className="mt-6 space-y-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm font-medium text-emerald-300">AI Evaluation Complete</p>
              <ScoreBar score={result.analysis.score} />
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                  <p className="text-sm font-semibold text-white">Strengths</p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-300">
                    {result.analysis.strengths.map((s) => <li key={s}>• {s}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                  <p className="text-sm font-semibold text-white">Weaknesses</p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-300">
                    {result.analysis.weaknesses.map((w) => <li key={w}>• {w}</li>)}
                  </ul>
                </div>
              </div>
              {result.analysis.skills?.length > 0 && (
                <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                  <p className="text-sm font-semibold text-white mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                <p className="text-sm font-semibold text-white">AI Summary</p>
                <p className="mt-2 text-sm text-gray-300">{result.analysis.summary}</p>
              </div>
              <Button variant="secondary" onClick={() => navigate(`/report/${result.id}`)}>
                Open AI Report
              </Button>
            </Motion.div>
          ) : null}

          {!loading && !result ? (
            <Motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 rounded-2xl border border-dashed border-gray-700 p-6 text-sm text-gray-400"
            >
              Submit a candidate to generate AI insights.
            </Motion.div>
          ) : null}
        </AnimatePresence>
      </Card>
      </div>
    </div>
  )
}
