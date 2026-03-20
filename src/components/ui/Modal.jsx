import { AnimatePresence, motion as Motion } from 'framer-motion'

export function Modal({ open, title, onClose, children }) {
  return (
    <AnimatePresence>
      {open ? (
        <Motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Motion.div
            className="w-full max-w-3xl rounded-2xl border border-white/10 bg-zinc-950 p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
              <button className="text-zinc-400 transition hover:text-zinc-200" onClick={onClose}>
                Close
              </button>
            </div>
            {children}
          </Motion.div>
        </Motion.div>
      ) : null}
    </AnimatePresence>
  )
}
