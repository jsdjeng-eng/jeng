import { useEffect, useState } from 'react'
import { Menu, Wallet, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Markets', href: '#markets' },
  { label: 'Security', href: '#security' },
  { label: 'Wallets', href: '#wallets' },
  { label: 'Trust', href: '#trust' },
  { label: 'Docs', href: '#' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'pt-2' : 'pt-4'
      }`}
    >
      <div className="mx-auto w-full max-w-6xl px-4">
        <nav
          className={`glass flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 sm:px-5 ${
            scrolled ? 'shadow-2xl shadow-black/40' : ''
          }`}
        >
          <a href="#" className="flex items-center gap-2.5">
            <div className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500" />
              <svg
                viewBox="0 0 32 32"
                className="relative h-5 w-5 text-white"
                fill="currentColor"
              >
                <path d="M8 9 L16 24 L24 9 L20 9 L16 17 L12 9 Z" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight text-white">
              Vaultline
            </span>
            <span className="ml-1.5 hidden rounded-md border border-cyan-400/30 bg-cyan-400/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan-300 sm:inline">
              v3
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:text-white sm:inline-block"
            >
              Sign in
            </a>
            <button
              type="button"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 px-3.5 py-2 text-sm font-semibold text-ink-950 shadow-lg shadow-violet-500/30 transition hover:shadow-violet-500/50 sm:px-4"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Wallet className="relative h-4 w-4" />
              <span className="relative">Connect Wallet</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="glass mt-2 rounded-2xl p-2 lg:hidden">
            <ul className="flex flex-col">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}
