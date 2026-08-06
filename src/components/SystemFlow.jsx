import { motion as Motion } from 'framer-motion'
import { FileText, Cpu, Github, ShieldCheck, Database, ArrowRight, ScanSearch } from 'lucide-react'

const systemNodes = [
  { id: 'input', icon: FileText, label: 'PDF Resume', sub: 'Claim Extraction' },
  { id: 'identity-agent', icon: ScanSearch, label: 'Identity Agent', sub: '3-Way Name Check' },
  { id: 'github-agent', icon: Github, label: 'Evidence Agent', sub: 'GitHub Claim Audit' },
  { id: 'decision-agent', icon: Cpu, label: 'Decision Agent', sub: 'Risk + Verdict' },
  { id: 'blockchain', icon: ShieldCheck, label: 'On-Chain Proof', sub: 'Tamper-Evident Hash' },
  { id: 'storage', icon: Database, label: 'Recruiter Console', sub: 'Decision Ready' },
]

const infoTags = [
  { label: 'Data Ingest', detail: 'pdfjs-dist coordinate parser' },
  { label: 'Agentic Layer', detail: 'Resume, identity, evidence, decision agents' },
  { label: 'Evidence', detail: 'Resume parsing + GitHub API + identity verification' },
  { label: 'Trust Model', detail: 'Tamper-evident decision report anchored on-chain' },
]

export function SystemFlow() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-950 p-6 md:p-10">
      <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-60 mask-[radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />

      <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row md:gap-3">
        {systemNodes.map((node, index) => (
          <div key={node.id} className="flex w-full flex-1 flex-col items-center md:w-auto md:flex-row">
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="relative z-10 flex w-full flex-col items-center justify-center rounded-2xl border border-ink-800 bg-ink-925 p-4 text-center transition-colors duration-200 hover:border-ink-600 md:w-40"
            >
              <div className="mb-3 rounded-xl border border-ink-800 bg-ink-900 p-2 text-ink-300">
                <node.icon className="size-5" />
              </div>
              <p className="mb-0.5 text-sm font-bold text-ink-50">{node.label}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{node.sub}</p>
            </Motion.div>

            {index < systemNodes.length - 1 ? (
              <div className="flex items-center justify-center py-3 md:flex-1 md:py-0">
                {/* Horizontal connector (desktop) */}
                <Motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 + 0.25, duration: 0.4 }}
                  className="relative hidden h-px w-full items-center justify-center bg-linear-to-r from-ink-800 via-ink-600 to-ink-800 md:flex"
                >
                  <Motion.span
                    animate={{ x: [-18, 18], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                    className="absolute size-1 rounded-full bg-ink-200"
                  />
                  <ArrowRight className="relative size-3 text-ink-600" />
                </Motion.div>

                {/* Vertical connector (mobile) */}
                <div className="h-6 w-px bg-ink-800 md:hidden" />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="relative mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {infoTags.map((tag) => (
          <div key={tag.label} className="rounded-xl border border-ink-800 bg-ink-925 p-3 text-center">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-ink-500">{tag.label}</p>
            <p className="text-[11px] text-ink-300">{tag.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
