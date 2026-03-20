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
      <Card className="group h-full transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-400/40 hover:shadow-indigo-500/20">
        <IconComponent className="mb-4 size-5 text-gray-300 transition group-hover:text-indigo-300" />
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </Card>
    </Motion.div>
  )
}
