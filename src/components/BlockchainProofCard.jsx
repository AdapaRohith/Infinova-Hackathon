import { CheckCircle2, Copy, ExternalLink, LoaderCircle, ShieldCheck, XCircle } from 'lucide-react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { formatDateTime } from '../utils/helpers'

const shortenHash = (value) => {
  if (!value) return 'Not available yet'
  if (value.length <= 20) return value
  return `${value.slice(0, 10)}...${value.slice(-8)}`
}

export function BlockchainProofCard({
  hash,
  txHash,
  timestamp,
  status = 'pending',
  statusMessage,
  onCopyHash,
  copied,
  agentSignature,
}) {
  const etherscanUrl = txHash ? `https://sepolia.etherscan.io/tx/${txHash}` : ''

  const statusConfig =
    status === 'verified'
      ? {
          label: 'Verified On-Chain',
          badge: <Badge success>Verified On-Chain</Badge>,
          icon: <CheckCircle2 className="size-4 text-emerald-300" />,
          cardGlow: 'border-emerald-500/30 shadow-emerald-500/10',
        }
      : status === 'tampered'
        ? {
            label: 'Tampered',
            badge: <Badge className="bg-red-500/20 text-red-300 ring-1 ring-red-400/40">Tampered</Badge>,
            icon: <XCircle className="size-4 text-red-300" />,
            cardGlow: 'border-red-500/30 shadow-red-500/10',
          }
        : {
            label: 'Pending',
            badge: <Badge className="bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/40">Pending</Badge>,
            icon: <LoaderCircle className="size-4 animate-spin text-amber-200" />,
            cardGlow: 'border-amber-500/30 shadow-amber-500/10',
          }

  return (
    <Card className={`rounded-2xl p-6 shadow-lg ${statusConfig.cardGlow}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
           <h3 className="text-lg font-semibold text-white">🔐 Blockchain Proof</h3>
           {agentSignature && (
             <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
               <ShieldCheck className="size-3" />
               AGENT SIGNED
             </div>
           )}
        </div>
        {statusConfig.badge}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-gray-400">Hash</p>
            <Button
              variant="secondary"
              className="rounded-lg px-2 py-1 text-xs"
              onClick={onCopyHash}
            >
              <Copy className="mr-1 size-3.5" />
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="mt-2 text-sm font-mono text-gray-200" title={hash || 'Not generated yet'}>
            {shortenHash(hash)}
          </p>
          <p className="mt-2 text-[10px] text-gray-500 italic">
            Includes AI Agent Signature: {shortenHash(agentSignature) || 'N/A'}
          </p>
        </div>


        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-xs text-gray-400">Status & Timestamp</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-200">
            {statusConfig.icon}
            <span>{statusConfig.label}</span>
          </div>
          <p className="mt-2 text-sm text-gray-300">{formatDateTime(timestamp)}</p>
          <p className="mt-3 text-xs text-gray-400">{statusMessage || 'Ready to create blockchain proof.'}</p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-xs text-gray-400">Transaction</p>
          <p className="mt-2 text-sm font-mono text-gray-300" title={txHash || '—'}>
            {shortenHash(txHash)}
          </p>
          <a
            href={etherscanUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-200 transition hover:border-indigo-400/60 hover:text-white"
            onClick={(event) => {
              if (!etherscanUrl) event.preventDefault()
            }}
          >
            <ExternalLink className="size-3.5" />
            View on Etherscan 🔗
          </a>
        </div>
      </div>
    </Card>
  )
}
