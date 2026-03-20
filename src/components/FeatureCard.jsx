import { motion as Motion } from 'framer-motion'
import { Card } from './ui/Card'

export function FeatureCard({ icon, title, description, delay = 0 }) {
  const IconComponent = icon

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
    >
      <Card className="group h-full transition hover:-translate-y-1 hover:border-white/20">
        <IconComponent className="mb-4 size-5 text-zinc-300 transition group-hover:text-white" />
        <h3 className="mb-2 text-lg font-semibold text-zinc-100">{title}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </Card>
    </Motion.div>
  )
}
