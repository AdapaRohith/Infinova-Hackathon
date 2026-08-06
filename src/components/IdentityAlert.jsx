import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react'

/**
 * Displays an identity cross-verification alert.
 * Surfaces MISMATCH / PARTIAL / MATCH, or nothing when data is unavailable.
 * Chrome stays monochrome — only the icon and title carry state colour.
 */
const config = {
  MISMATCH: {
    Icon: AlertTriangle,
    ink: 'text-state-bad',
    title: 'Identity Verification Failed',
    badgeText: 'Unverified Identity',
    mark: '!',
  },
  PARTIAL: {
    Icon: HelpCircle,
    ink: 'text-state-warn',
    title: 'Partial Match — Manual Review Suggested',
    badgeText: 'Partial Match',
    mark: '?',
  },
  MATCH: {
    Icon: CheckCircle2,
    ink: 'text-state-ok',
    title: 'Identity Verified',
    badgeText: 'Identity Match',
    mark: '✓',
  },
}

export function IdentityAlert({ identityCheck, compact = false }) {
  if (!identityCheck || identityCheck.status === 'UNAVAILABLE') return null

  const c = config[identityCheck.status]
  if (!c) return null

  const { Icon } = c

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md border border-ink-700 bg-ink-850 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${c.ink}`}
      >
        {c.mark} {c.badgeText}
      </span>
    )
  }

  const sources = [
    { label: 'Form Name', value: identityCheck.formName },
    { label: 'Resume Name', value: identityCheck.resumeName },
    { label: 'GitHub Profile', value: identityCheck.githubName },
  ]

  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-950 p-4">
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 size-5 shrink-0 ${c.ink}`} />
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold ${c.ink}`}>{c.title}</p>
          <p className="mt-1 text-sm text-ink-300">{identityCheck.details}</p>

          {identityCheck.status !== 'MATCH' ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {sources.map((source) => (
                <div key={source.label} className="rounded-lg border border-ink-800 bg-ink-925 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-ink-500">{source.label}</p>
                  <p className="mt-0.5 truncate text-sm font-medium text-ink-100" title={source.value || ''}>
                    {source.value || '—'}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
