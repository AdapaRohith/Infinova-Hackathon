import { motion as Motion } from 'framer-motion'
import { Brain, Blocks, LayoutDashboard, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FeatureCard } from '../components/FeatureCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const features = [
  {
    icon: Brain,
    title: 'AI Evaluation',
    description: 'Autonomous assessment engine simulates deep capability verification.',
  },
  {
    icon: Blocks,
    title: 'Blockchain Verification',
    description: 'Each candidate proof is hashed and recorded for immutable trust.',
  },
  {
    icon: LayoutDashboard,
    title: 'Recruiter Dashboard',
    description: 'Track evaluated candidates with instant verification status and filters.',
  },
]

export function LandingPage() {
  return (
    <div className="space-y-14 pb-16 md:space-y-20">
      <section className="grid items-center gap-10 pt-10 lg:grid-cols-2 lg:pt-16">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 inline-flex rounded-full border border-white/10 bg-zinc-950 px-3 py-1 text-xs text-zinc-400">
            Trust Layer for Hiring Decisions
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-100 md:text-6xl">
            Verified Talent. Not Just Resumes.
          </h1>
          <p className="mt-4 max-w-xl text-zinc-300 md:text-lg">
            AI-powered candidate verification with blockchain-backed trust. Proof-of-Workforce turns subjective resumes into evidence-backed hiring signals.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/analyze">
              <Button>Analyze Candidate</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary">View Dashboard</Button>
            </Link>
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <p className="text-xl font-semibold text-zinc-100">91%</p>
              <p className="mt-1 text-xs text-zinc-500">Avg AI confidence</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-xl font-semibold text-zinc-100">2.1s</p>
              <p className="mt-1 text-xs text-zinc-500">Mock analysis time</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-xl font-semibold text-zinc-100">100%</p>
              <p className="mt-1 text-xs text-zinc-500">Traceable proofs</p>
            </Card>
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur"
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
              <p className="text-xs text-zinc-500">Live Verification Snapshot</p>
              <p className="mt-2 text-sm text-zinc-300">AI confidence: 91%</p>
              <p className="text-sm text-zinc-300">Proof hash: 0x8cf...f23d</p>
              <p className="text-sm text-emerald-300">Status: Verified on-chain</p>
            </div>
            <section
              aria-label="Verification details"
              className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4"
            >
              <h3 className="text-sm font-semibold text-zinc-100">What this proof includes</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-zinc-400" aria-hidden="true" />
                  Candidate identity metadata tied to AI evaluation output
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-zinc-400" aria-hidden="true" />
                  Immutable hash + timestamp for independent verification
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                  On-chain status signal recruiters can trust at review time
                </li>
              </ul>
            </section>
          </div>
        </Motion.div>
      </section>

      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-zinc-100">Platform Capabilities</h2>
          <p className="mt-2 text-zinc-400">A clear workflow for trustworthy hiring decisions.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} delay={index * 0.12} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-zinc-100">How It Works</h2>
          <p className="mt-2 text-zinc-400">Simple, auditable flow from submission to verification.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="space-y-3">
            <div className="inline-flex rounded-full bg-zinc-800/80 p-2">
              <Sparkles className="size-4 text-zinc-200" />
            </div>
            <p className="text-sm font-semibold text-zinc-100">1. Submit Candidate</p>
            <p className="text-sm text-zinc-400">Upload candidate context (name, resume, and portfolio link).</p>
          </Card>
          <Card className="space-y-3">
            <div className="inline-flex rounded-full bg-zinc-800/80 p-2">
              <Workflow className="size-4 text-zinc-200" />
            </div>
            <p className="text-sm font-semibold text-zinc-100">2. AI Evaluation</p>
            <p className="text-sm text-zinc-400">Generate score, strengths, weaknesses, and concise hiring summary.</p>
          </Card>
          <Card className="space-y-3">
            <div className="inline-flex rounded-full bg-zinc-800/80 p-2">
              <ShieldCheck className="size-4 text-emerald-300" />
            </div>
            <p className="text-sm font-semibold text-zinc-100">3. On-chain Proof</p>
            <p className="text-sm text-zinc-400">Create immutable hash proof and verify it instantly via lookup.</p>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold text-zinc-100">About Proof-of-Workforce</h3>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            Proof-of-Workforce is built as a hiring trust infrastructure layer. It does not replace recruiters or ATS workflows.
            It adds a defensible verification signal, helping teams justify hiring decisions with transparent AI output and tamper-resistant proof records.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-400">
            <li>• Reduces resume inflation risk with structured assessment signals.</li>
            <li>• Enables audit-friendly candidate history for leadership and compliance.</li>
            <li>• Improves recruiter confidence with consistent, comparable reports.</li>
          </ul>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-zinc-100">Why Teams Use It</h3>
          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-3">
              <p className="font-medium text-zinc-100">For Recruiters</p>
              <p className="mt-1 text-zinc-400">Get clarity fast on who to advance and why.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-3">
              <p className="font-medium text-zinc-100">For Hiring Managers</p>
              <p className="mt-1 text-zinc-400">See strengths and risk areas before technical interviews.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-3">
              <p className="font-medium text-zinc-100">For Operations</p>
              <p className="mt-1 text-zinc-400">Retain proof trails and verification records for decision audits.</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
