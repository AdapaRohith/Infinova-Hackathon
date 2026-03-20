import { cn } from '../../utils/helpers'

export function Card({ className, children }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-800 bg-gray-900/80 p-6 shadow-xl backdrop-blur-md',
        className,
      )}
    >
      {children}
    </div>
  )
}
