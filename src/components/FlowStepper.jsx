import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import { cn } from '../utils/helpers'

const steps = [
  {
    title: 'Upload Candidate',
    detail: 'Capture resume and profile metadata as structured input for analysis.',
    to: '/analyze',
  },
  {
    title: 'AI Analysis',
    detail: 'Run model-driven skill scoring, strengths, weaknesses, and summary generation.',
    to: '/analyze',
  },
  {
    title: 'Generate Proof',
    detail: 'Create an immutable hash with timestamp and verified on-chain status.',
    to: '/dashboard',
  },
  {
    title: 'Verify on Blockchain',
    detail: 'Validate trust by resolving proof hash back to candidate and report data.',
    to: '/verify',
  },
]

export function FlowStepper({ currentStep = 1 }) {
  const [focusStep, setFocusStep] = useState(currentStep)

  useEffect(() => {
    setFocusStep(currentStep)
  }, [currentStep])

  const selectedStep = steps[focusStep - 1] ?? steps[0]

  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-925 p-4">
      <p className="text-xs uppercase tracking-wider text-ink-500">Interactive Workflow</p>

      <ol className="mt-3 grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const active = stepNumber === focusStep
          const done = stepNumber < currentStep

          return (
            <li key={step.title} className="relative">
              <button
                type="button"
                aria-current={active ? 'step' : undefined}
                onMouseEnter={() => setFocusStep(stepNumber)}
                onFocus={() => setFocusStep(stepNumber)}
                onClick={() => setFocusStep(stepNumber)}
                className={cn(
                  'w-full rounded-xl border p-3 text-left transition-colors duration-200',
                  active
                    ? 'border-ink-500 bg-ink-850'
                    : 'border-ink-800 bg-ink-950 hover:border-ink-600',
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                      done
                        ? 'bg-ink-50 text-ink-1000'
                        : active
                          ? 'bg-ink-700 text-ink-50'
                          : 'bg-ink-850 text-ink-400',
                    )}
                  >
                    {done ? <Check className="size-3.5" /> : stepNumber}
                  </span>
                  <p className={cn('text-sm font-medium', active ? 'text-ink-50' : 'text-ink-300')}>
                    {step.title}
                  </p>
                </div>
              </button>

              {index < steps.length - 1 ? (
                <div className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-4 bg-ink-700 md:block" />
              ) : null}
            </li>
          )
        })}
      </ol>

      <Motion.div
        key={focusStep}
        className="mt-4 rounded-xl border border-ink-800 bg-ink-950 p-4"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-xs uppercase tracking-wider text-ink-500">Flow Step {focusStep}</p>
        <p className="mt-1 text-sm font-semibold text-ink-50">{selectedStep.title}</p>
        <p className="mt-2 text-sm text-ink-300">{selectedStep.detail}</p>
        <Link
          to={selectedStep.to}
          className="mt-3 inline-flex items-center gap-1 rounded-lg border border-ink-700 bg-ink-900 px-3 py-1.5 text-xs font-medium text-ink-200 transition-colors hover:border-ink-500 hover:text-ink-50"
        >
          Open Step
          <ArrowUpRight className="size-3.5" />
        </Link>
      </Motion.div>
    </div>
  )
}
