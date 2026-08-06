import { motion as Motion } from 'framer-motion'
import { CheckCircle2, LoaderCircle, SearchX, XCircle } from 'lucide-react'

const configs = {
  verified: {
    title: 'VERIFIED ON-CHAIN',
    message: 'This hiring report still matches the attestation stored on the blockchain.',
    Icon: CheckCircle2,
    ink: 'text-state-ok',
    spin: false,
  },
  pending: {
    title: 'VERIFYING ATTESTATION',
    message: 'Checking this report hash against the blockchain record.',
    Icon: LoaderCircle,
    ink: 'text-state-warn',
    spin: true,
  },
  notfound: {
    title: 'NO ATTESTATION FOUND',
    message: 'No candidate in this workspace carries that hash. Check the value and try again.',
    Icon: SearchX,
    ink: 'text-ink-300',
    spin: false,
  },
  tampered: {
    title: 'TAMPERED',
    message: 'This report no longer matches the original blockchain attestation.',
    Icon: XCircle,
    ink: 'text-state-bad',
    spin: false,
  },
}

export function VerificationResultBanner({ status = 'idle' }) {
  const config = configs[status]
  if (!config) return null

  const { Icon } = config

  return (
    <Motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-3xl"
      role="status"
      aria-live="polite"
    >
      <div className="rounded-2xl border border-ink-800 bg-ink-925 p-8 text-center">
        <div className="flex justify-center">
          <Icon className={`size-8 ${config.ink} ${config.spin ? 'animate-spin' : ''}`} />
        </div>
        <p className={`mt-4 text-3xl font-extrabold tracking-wide sm:text-4xl ${config.ink}`}>
          {config.title}
        </p>
        <p className="mx-auto mt-2 max-w-xl text-base text-ink-400">{config.message}</p>
      </div>
    </Motion.div>
  )
}
