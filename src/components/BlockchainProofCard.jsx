import { Check, Circle, Copy, ExternalLink, LoaderCircle, ShieldCheck, X } from 'lucide-react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { formatDateTime } from '../utils/helpers'
import {
  blockchainNetworkLabel,
  attestationReferenceLabel,
  attestationReferenceValue,
  contractExplorerUrl,
  getTxExplorerUrl,
} from '../utils/blockchain'

const shortenHash = (value) => {
  if (!value) return ''
  if (value.length <= 20) return value
  return `${value.slice(0, 10)}...${value.slice(-8)}`
}

const statusMap = {
  verified: {
    label: 'Verified on Algorand',
    tone: 'ok',
    icon: <Check className="size-4 text-state-ok" />,
  },
  tampered: {
    label: 'Tampered',
    tone: 'bad',
    icon: <X className="size-4 text-state-bad" />,
  },
  pending: {
    label: 'Pending confirmation',
    tone: 'warn',
    icon: <LoaderCircle className="size-4 animate-spin text-state-warn" />,
  },
  idle: {
    label: 'Not generated yet',
    tone: 'neutral',
    icon: <Circle className="size-4 text-ink-500" />,
  },
}

function Tile({ label, children, className = '' }) {
  return (
    <div className={`rounded-xl border border-ink-800 bg-ink-950 p-4 ${className}`}>
      <p className="text-xs text-ink-500">{label}</p>
      {children}
    </div>
  )
}

export function BlockchainProofCard({
  candidateId,
  hash,
  txHash,
  timestamp,
  status = 'idle',
  statusMessage,
  onCopyHash,
  copied,
  agentSignature,
}) {
  const explorerUrl = getTxExplorerUrl(txHash)
  const proofPending = !hash && !txHash
  const config = statusMap[status] ?? statusMap.idle

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold text-ink-50">Algorand Hiring Attestation</h3>
          {agentSignature ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-ink-700 bg-ink-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-300">
              <ShieldCheck className="size-3" />
              Agent Signed
            </span>
          ) : null}
        </div>
        <Badge tone={config.tone}>{config.label}</Badge>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Tile label="Proof Hash">
          <div className="mt-2 flex items-start justify-between gap-2">
            {proofPending ? (
              <p className="text-sm font-medium text-ink-400">Proof not generated yet</p>
            ) : (
              <p className="break-all font-mono text-sm text-ink-100" title={hash}>
                {shortenHash(hash)}
              </p>
            )}
            <Button
              type="button"
              variant="secondary"
              className="shrink-0 rounded-lg px-2 py-1 text-xs"
              onClick={onCopyHash}
              disabled={!hash}
            >
              <Copy className="size-3.5" />
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="mt-2 text-[10px] italic text-ink-500">
            {proofPending
              ? 'Hash, transaction link, and agent seal appear after you generate the Algorand proof.'
              : `Includes AI agent signature: ${shortenHash(agentSignature) || 'not attached'}`}
          </p>
        </Tile>

        <Tile label="Status and Timestamp">
          <div className="mt-2 flex items-center gap-2 text-sm text-ink-100">
            {config.icon}
            <span>{config.label}</span>
          </div>
          <p className="mt-2 text-sm text-ink-300">{formatDateTime(timestamp)}</p>
          <p className="mt-3 text-xs text-ink-500">{statusMessage || 'Ready to create Algorand proof.'}</p>
        </Tile>

        <Tile label="Transaction">
          <p className="mt-2 break-all font-mono text-sm text-ink-200" title={txHash || 'Pending proof generation'}>
            {shortenHash(txHash) || 'Created after Algorand submission'}
          </p>
          <a
            href={explorerUrl || undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!explorerUrl}
            className={`mt-3 inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              explorerUrl
                ? 'border-ink-700 bg-ink-900 text-ink-200 hover:border-ink-500 hover:text-ink-50'
                : 'pointer-events-none cursor-not-allowed border-ink-800 bg-ink-925 text-ink-600'
            }`}
          >
            <ExternalLink className="size-3.5" />
            {explorerUrl ? 'View on Explorer' : 'Explorer link available after proof'}
          </a>
        </Tile>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Tile label="Candidate ID">
          <p className="mt-2 break-all font-mono text-sm text-ink-200">{candidateId || 'Pending candidate'}</p>
        </Tile>
        <Tile label="Network">
          <p className="mt-2 text-sm text-ink-200">{blockchainNetworkLabel}</p>
        </Tile>
        <Tile label={attestationReferenceLabel}>
          <a
            href={contractExplorerUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm text-ink-200 transition-colors hover:text-ink-50"
          >
            <span className="font-mono">{attestationReferenceValue}</span>
            <ExternalLink className="size-3.5" />
          </a>
        </Tile>
        <Tile label="Attestation Type">
          <p className="mt-2 text-sm text-ink-200">Tamper-evident hiring report hash</p>
        </Tile>
      </div>
    </Card>
  )
}
