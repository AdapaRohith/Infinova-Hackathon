import { Link, NavLink } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/analyze', label: 'Analyze' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/verify', label: 'Verify' },
]

const linkClasses = ({ isActive }) =>
  `relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
    isActive ? 'text-ink-50' : 'text-ink-400 hover:text-ink-100'
  }`

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-1000/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl border border-ink-700 bg-ink-900">
            <ShieldCheck className="size-5 text-ink-100" />
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-ink-50 md:text-lg">
              Proof-of-Workforce
            </span>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-ink-500" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500">
                Agentic Trust Layer
              </p>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-xl border border-ink-800 bg-ink-950 p-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClasses}>
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{link.label}</span>
                  {isActive ? (
                    <Motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 z-0 rounded-lg bg-ink-850"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/analyze"
          className="hidden rounded-xl bg-ink-50 px-4 py-2 text-sm font-medium text-ink-1000 transition-colors hover:bg-white md:inline-flex"
        >
          Start Analysis
        </Link>
      </div>

      {/* Mobile navigation — every route stays reachable on small screens */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-ink-800 px-4 py-2 md:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-ink-850 text-ink-50' : 'text-ink-400 hover:text-ink-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
