import { motion as Motion } from 'framer-motion'
import { Card } from './ui/Card'

export function FeatureCard({ icon, title, description, delay = 0 }) {
  const IconComponent = icon

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className="h-full"
    >
      <Card className="group relative h-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/4 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex rounded-xl border border-ink-800 bg-ink-900 p-2.5 transition-colors duration-200 group-hover:border-ink-600">
            <IconComponent className="size-5 text-ink-400 transition-colors duration-200 group-hover:text-ink-50" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-ink-50">{title}</h3>
          <p className="text-sm leading-relaxed text-ink-400 transition-colors group-hover:text-ink-300">
            {description}
          </p>
        </div>
      </Card>
    </Motion.div>
  )
}
