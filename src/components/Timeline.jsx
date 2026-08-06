import { Check, CircleDashed } from 'lucide-react'
import { formatDateTime } from '../utils/helpers'

export function Timeline({ candidate }) {
  const steps = [
    {
      label: 'AI Analysis Completed',
      done: Boolean(candidate?.analysis),
      timestamp: candidate?.createdAt,
    },
    {
      label: 'Hash Generated',
      done: Boolean(candidate?.verification?.hash),
      timestamp: candidate?.verification?.timestamp,
    },
    {
      label: 'Verified on Algorand',
      done: Boolean(candidate?.verification?.status?.startsWith('Verified')),
      timestamp: candidate?.verification?.timestamp,
    },
  ]

  return (
    <ol className="space-y-3">
      {steps.map((step) => (
        <li key={step.label} className="flex items-start gap-3">
          <span
            className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${
              step.done ? 'border-ink-400 bg-ink-100 text-ink-1000' : 'border-ink-700 text-ink-600'
            }`}
          >
            {step.done ? <Check className="size-3" /> : <CircleDashed className="size-3" />}
          </span>
          <div>
            <p className={`text-sm ${step.done ? 'text-ink-100' : 'text-ink-400'}`}>{step.label}</p>
            <p className="text-xs text-ink-500">
              {step.done && step.timestamp ? formatDateTime(step.timestamp) : 'Pending'}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
