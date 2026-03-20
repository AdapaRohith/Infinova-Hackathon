import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/analyze', label: 'Analyze' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/verify', label: 'Verify' },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <Link to="/" className="text-sm font-semibold tracking-wide text-zinc-100">
            Proof-of-Workforce
          </Link>
          <p className="mt-1 text-xs text-zinc-500">AI + Blockchain Hiring Trust Layer</p>
        </div>
        <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-zinc-950/90 p-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? 'text-zinc-100'
                    : 'text-zinc-300 hover:text-zinc-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
