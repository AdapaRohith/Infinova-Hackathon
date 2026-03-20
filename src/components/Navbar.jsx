import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/analyze', label: 'Analyze' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/verify', label: 'Verify' },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <Link to="/" className="text-sm font-semibold tracking-wide text-white">
            Proof-of-Workforce
          </Link>
          <p className="mt-1 text-xs text-gray-400">AI + Blockchain Hiring Trust Layer</p>
        </div>
        <nav className="flex items-center gap-1 rounded-full border border-gray-800 bg-gray-900/80 p-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:text-white'
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
