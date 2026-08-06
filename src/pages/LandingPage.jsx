import { motion as Motion } from 'framer-motion'
import {
  Brain,
  Blocks,
  LayoutDashboard,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { FeatureCard } from '../components/FeatureCard'
import { FlowStepper } from '../components/FlowStepper'
import { SystemFlow } from '../components/SystemFlow'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const features = [
  {
    icon: Brain,
    title: 'Agentic Verification',
    description: 'Multiple agents extract claims, cross-check identity, audit GitHub evidence, and issue a recruiter verdict.',
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

const stats = [
  { icon: Sparkles, value: 'AI', label: 'Structured Evaluation' },
  { icon: Shield, value: 'Web3', label: 'On-chain Proof' },
  { icon: Zap, value: 'Audit', label: 'Skill Verification' },
]

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const proofPoints = [
  '3-way identity check across form name, resume name, and GitHub profile',
  'Evidence-backed claim audit against public GitHub data',
  'Immutable hash and timestamp for independent recruiter verification',
]

export function LandingPage() {
  return (
    <div className="space-y-16 pb-20 md:space-y-24">

      {/* ═══ HERO ═══ */}
      <section className="relative grid items-center gap-10 overflow-hidden rounded-3xl border border-ink-800 bg-ink-950 p-8 pt-10 lg:grid-cols-2 lg:p-12 lg:pt-14">
        {/* Monochrome ambience */}
        <div className="pointer-events-none absolute inset-0 bg-linegrid opacity-70 mask-[radial-gradient(ellipse_at_center,black_25%,transparent_78%)]" />
        <div className="pointer-events-none absolute -left-24 -top-32 size-72 rounded-full bg-white/5 blur-[110px] animate-float" />
        <div className="pointer-events-none absolute -bottom-28 -right-24 size-80 rounded-full bg-white/4 blur-[120px]" />

        {/* Left: Copy */}
        <Motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10">
          <Motion.p
            variants={fadeUp}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900 px-4 py-1.5 text-xs font-medium text-ink-300"
          >
            <span className="size-1.5 rounded-full bg-ink-100 animate-sheen" />
            Trust Layer for Hiring Decisions
          </Motion.p>

          <Motion.h1
            variants={fadeUp}
            className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-50 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Verified Talent.{' '}
            <span className="text-ink-500">Not Just Resumes.</span>
          </Motion.h1>

          <Motion.p variants={fadeUp} className="mt-5 max-w-lg text-base text-ink-300 md:text-lg">
            An agentic hiring trust engine that verifies identity, audits public code claims, and anchors tamper-proof reports on-chain.
          </Motion.p>

          <Motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Link to="/analyze">
              <Button>Analyze Candidate</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">View Dashboard</Button>
            </Link>
          </Motion.div>

          <Motion.p variants={fadeUp} className="mt-6 max-w-lg text-sm italic text-ink-500">
            Hiring based on claims is broken. We verify truth.
          </Motion.p>

          {/* Stats row */}
          <Motion.div variants={fadeUp} className="mt-8 grid max-w-lg grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group rounded-xl border border-ink-800 bg-ink-900/70 p-4 text-center transition-colors duration-200 hover:border-ink-600"
              >
                <stat.icon className="mx-auto mb-2 size-4 text-ink-400 transition-colors group-hover:text-ink-100" />
                <p className="text-lg font-bold text-ink-50">{stat.value}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-ink-500">{stat.label}</p>
              </div>
            ))}
          </Motion.div>
        </Motion.div>

        {/* Right: Preview panel */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.96, x: 16 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="relative z-10 rounded-2xl border border-ink-800 bg-ink-925/90 p-6 backdrop-blur-xl"
        >
          <div className="space-y-4">
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-ink-800 bg-ink-950 p-4"
            >
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
                <span className="size-1.5 rounded-full bg-state-ok" />
                Live Verification Status
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-300">
                Every analysis produces a recruiter verdict, evidence snapshot, skill verification report, and blockchain proof.
              </p>
              <p className="mt-1.5 text-sm text-ink-500">
                Designed to verify developer authenticity, not just score resumes.
              </p>
            </Motion.div>

            <Motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              aria-label="Verification details"
              className="rounded-xl border border-ink-800 bg-ink-950 p-4"
            >
              <h3 className="text-sm font-semibold text-ink-50">What this proof includes</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-ink-300">
                {proofPoints.map((text) => (
                  <li key={text} className="flex items-start gap-2.5">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ink-500" aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>
            </Motion.section>
          </div>
        </Motion.div>
      </section>

      {/* ═══ INTERACTIVE WORKFLOW ═══ */}
      <Motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-ink-50">Interactive Workflow</h2>
          <p className="mt-2 text-ink-400">Step-by-step guide to using the Proof-of-Workforce platform.</p>
        </div>
        <FlowStepper currentStep={1} />
      </Motion.section>

      {/* ═══ PLATFORM CAPABILITIES ═══ */}
      <section>
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-ink-50">Platform Capabilities</h2>
          <p className="mt-2 text-ink-400">Built to make hiring decisions evidence-driven and audit-friendly.</p>
        </Motion.div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} delay={index * 0.1} />
          ))}
        </div>
      </section>

      {/* ═══ SYSTEM FLOW ═══ */}
      <Motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-ink-50">System Flow</h2>
          <p className="mt-2 text-ink-400">The technical architecture that powers our autonomous trust engine.</p>
        </div>
        <SystemFlow />
      </Motion.section>

      {/* ═══ ABOUT + WHY ═══ */}
      <Motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="grid gap-5 lg:grid-cols-2"
      >
        <Motion.div variants={fadeUp}>
          <Card className="h-full">
            <h3 className="text-lg font-bold text-ink-50">About Proof-of-Workforce</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              Proof-of-Workforce is built as a hiring trust infrastructure layer. It does not replace recruiters or ATS workflows.
              It adds a defensible verification signal, helping teams justify hiring decisions with transparent AI output and tamper-resistant proof records.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-ink-400">
              {[
                'Reduces resume inflation risk with structured assessment signals.',
                'Enables audit-friendly candidate history for leadership and compliance.',
                'Improves recruiter confidence with consistent, comparable reports.',
              ].map((text) => (
                <li key={text} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-ink-500" />
                  {text}
                </li>
              ))}
            </ul>
          </Card>
        </Motion.div>

        <Motion.div variants={fadeUp}>
          <Card className="h-full">
            <h3 className="text-lg font-bold text-ink-50">Why Teams Use It</h3>
            <div className="mt-4 space-y-3">
              {[
                { role: 'For Recruiters', desc: 'Get clarity fast on who to advance and why.' },
                { role: 'For Hiring Managers', desc: 'See strengths and risk areas before technical interviews.' },
                { role: 'For Operations', desc: 'Retain proof trails and verification records for decision audits.' },
              ].map((item) => (
                <div
                  key={item.role}
                  className="rounded-xl border border-ink-800 bg-ink-950 p-3.5 transition-colors duration-200 hover:border-ink-600"
                >
                  <p className="text-sm font-semibold text-ink-50">{item.role}</p>
                  <p className="mt-1 text-sm text-ink-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </Motion.div>
      </Motion.section>
    </div>
  )
}
