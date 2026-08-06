import { useEffect, useRef } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { X } from 'lucide-react'

export function Modal({ open, title, onClose, children }) {
  // Held in a ref so an inline `onClose` prop can't retrigger the scroll lock effect.
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current?.()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <AnimatePresence>
      {open ? (
        <Motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Motion.div
            className="my-auto w-full max-w-4xl rounded-2xl border border-ink-800 bg-ink-950 p-6 shadow-2xl shadow-black/60 sm:my-8"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-ink-800 pb-4">
              <h3 className="text-lg font-semibold text-ink-50">{title}</h3>
              <button
                type="button"
                aria-label="Close dialog"
                className="rounded-lg border border-ink-800 p-1.5 text-ink-400 transition-colors hover:border-ink-600 hover:text-ink-50"
                onClick={onClose}
              >
                <X className="size-4" />
              </button>
            </div>
            {children}
          </Motion.div>
        </Motion.div>
      ) : null}
    </AnimatePresence>
  )
}
