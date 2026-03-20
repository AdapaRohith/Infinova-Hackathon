import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'

const initialForm = {
  name: '',
  email: '',
  link: '',
  resumeName: '',
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
    <div className="grid gap-6 pb-14 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <h1 className="text-2xl font-semibold text-zinc-100">Candidate Analysis</h1>
        <p className="mt-2 text-sm text-zinc-400">Run AI skill verification and generate a trusted candidate profile.</p>

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
          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span>Resume Upload (mock)</span>
            <input
              type="file"
              onChange={(event) =>
                handleChange('resumeName', event.target.files?.[0]?.name || '')
              }
              className="rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-300"
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
        <h2 className="text-xl font-semibold text-zinc-100">AI Output</h2>
        <p className="mt-1 text-sm text-zinc-400">Simulated skill intelligence based on submitted profile.</p>

        {loading ? (
          <div className="mt-6 space-y-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : null}

        {!loading && result ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-zinc-300">Skill score: <span className="font-semibold text-zinc-100">{result.analysis.score}/100</span></p>
            <p className="text-sm text-zinc-300">Strengths: {result.analysis.strengths.join(', ')}</p>
            <p className="text-sm text-zinc-300">Weaknesses: {result.analysis.weaknesses.join(', ')}</p>
            <p className="text-sm text-zinc-300">Summary: {result.analysis.summary}</p>
            <Button variant="secondary" onClick={() => navigate(`/report/${result.id}`)}>
              Open AI Report
            </Button>
          </div>
        ) : null}

        {!loading && !result ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-6 text-sm text-zinc-500">
            Submit a candidate to generate AI insights.
          </div>
        ) : null}
      </Card>
    </div>
  )
}
