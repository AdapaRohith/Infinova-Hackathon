import { motion as Motion } from 'framer-motion'
import {
  Brain,
  Blocks,
  LayoutDashboard,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { FeatureCard } from '../components/FeatureCard'
import { FlowStepper } from '../components/FlowStepper'
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
      <section className="relative grid items-center gap-10 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 p-8 pt-10 lg:grid-cols-2 lg:p-10 lg:pt-12">
        <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute left-14 top-20 h-48 w-48 rounded-full bg-indigo-400/25 blur-[90px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[42px_42px] mask-[radial-gradient(ellipse_at_center,black_35%,transparent_85%)]" />

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <p className="mb-4 inline-flex rounded-full border border-gray-800 bg-gray-950 px-3 py-1 text-xs text-gray-400">
            Trust Layer for Hiring Decisions
          </p>
          <h1 className="text-balance text-5xl font-bold leading-[1.03] tracking-tight text-white md:text-7xl">
            <span className="bg-linear-to-r from-indigo-300 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
              Verified Talent.
            </span>{' '}
            Not Just Resumes.
          </h1>
          <p className="mt-4 max-w-xl text-gray-300 md:text-lg">
            AI-powered candidate evaluation with tamper-proof blockchain verification.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/analyze">
              <Button>Analyze Candidate</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary">View Dashboard</Button>
            </Link>
          </div>

          <p className="mt-6 max-w-2xl text-base italic text-gray-300 md:text-lg">
            Hiring based on claims is broken. We verify truth.
          </p>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <p className="text-xl font-semibold text-white">91%</p>
              <p className="mt-1 text-xs text-gray-400">Avg AI confidence</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-xl font-semibold text-white">2.1s</p>
              <p className="mt-1 text-xs text-gray-400">Mock analysis time</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-xl font-semibold text-white">100%</p>
              <p className="mt-1 text-xs text-gray-400">Traceable proofs</p>
            </Card>
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="relative rounded-2xl border border-gray-800 bg-gray-900/80 p-6 shadow-xl backdrop-blur"
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
              <p className="text-xs text-gray-400">Live Verification Snapshot</p>
              <p className="mt-2 text-sm text-gray-200">AI confidence: 91%</p>
              <p className="text-sm text-gray-200">Proof hash: 0x8cf...f23d</p>
              <p className="text-sm text-emerald-300">Status: Verified on-chain</p>
            </div>
            <section
              aria-label="Verification details"
              className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4"
            >
              <h3 className="text-sm font-semibold text-white">What this proof includes</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-gray-400" aria-hidden="true" />
                  Candidate identity metadata tied to AI evaluation output
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-gray-400" aria-hidden="true" />
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

      <FlowStepper currentStep={1} />

      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white">Platform Capabilities</h2>
          <p className="mt-2 text-gray-400">Built to make hiring decisions evidence-driven and audit-friendly.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} delay={index * 0.12} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white">System Flow</h2>
          <p className="mt-2 text-gray-400">From upload to immutable trust proof in four clear steps.</p>
        </div>
        <FlowStepper currentStep={1} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold text-white">About Proof-of-Workforce</h3>
          <p className="mt-3 text-sm leading-6 text-gray-300">
            Proof-of-Workforce is built as a hiring trust infrastructure layer. It does not replace recruiters or ATS workflows.
            It adds a defensible verification signal, helping teams justify hiring decisions with transparent AI output and tamper-resistant proof records.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>• Reduces resume inflation risk with structured assessment signals.</li>
            <li>• Enables audit-friendly candidate history for leadership and compliance.</li>
            <li>• Improves recruiter confidence with consistent, comparable reports.</li>
          </ul>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-white">Why Teams Use It</h3>
          <div className="mt-4 space-y-3 text-sm text-gray-300">
            <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-3">
              <p className="font-medium text-white">For Recruiters</p>
              <p className="mt-1 text-gray-400">Get clarity fast on who to advance and why.</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-3">
              <p className="font-medium text-white">For Hiring Managers</p>
              <p className="mt-1 text-gray-400">See strengths and risk areas before technical interviews.</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-3">
              <p className="font-medium text-white">For Operations</p>
              <p className="mt-1 text-gray-400">Retain proof trails and verification records for decision audits.</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
