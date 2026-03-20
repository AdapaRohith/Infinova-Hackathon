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
  name: 'Avery Quinn',
  email: 'avery@candidate.dev',
  link: 'https://github.com/avery',
  resumeName: 'Avery_Resume.pdf',
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
    if (!form.name || !form.email || !form.link) {
      toast.error('Please complete required fields')
      return
    }

    setLoading(true)
    setResult(null)

    const candidate = await onAnalyzeCandidate(form)
    setResult(candidate)
    setLoading(false)
    toast.success('AI analysis complete')
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
            <span>Resume Upload (mock)</span>
            <input
              type="file"
              onChange={(event) =>
                handleChange('resumeName', event.target.files?.[0]?.name || '')
              }
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
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setForm(initialForm)}
          >
            Use Demo Data
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
                  <p className="mt-2 text-sm text-gray-300">{result.analysis.strengths.join(', ')}</p>
                </div>
                <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                  <p className="text-sm font-semibold text-white">Weaknesses</p>
                  <p className="mt-2 text-sm text-gray-300">{result.analysis.weaknesses.join(', ')}</p>
                </div>
              </div>
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
              Submit a candidate to generate AI insights. Demo values are pre-filled for quick presentation.
            </Motion.div>
          ) : null}
        </AnimatePresence>
      </Card>
      </div>
    </div>
  )
}
