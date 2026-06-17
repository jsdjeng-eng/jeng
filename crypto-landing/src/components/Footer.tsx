type IconProps = { className?: string }

function TwitterIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

function GithubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.18c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.18c0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  )
}

function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.43v6.31ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

const COLUMNS = [
  {
    title: 'Product',
    links: ['Vaults', 'Trade', 'Stake', 'Lend', 'API'],
  },
  {
    title: 'Security',
    links: ['Audits', 'Proof of Reserves', 'Insurance', 'Bug bounty', 'Disclosures'],
  },
  {
    title: 'Company',
    links: ['About', 'Press', 'Careers', 'Compliance', 'Contact'],
  },
  {
    title: 'Resources',
    links: ['Docs', 'Status', 'Changelog', 'Blog', 'Newsletter'],
  },
]

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-ink-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
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
              <span className="text-base font-semibold text-white">
                Vaultline
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
              Institutional-grade self-custody for the open financial system.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { icon: TwitterIcon, label: 'Twitter' },
                { icon: GithubIcon, label: 'GitHub' },
                { icon: LinkedinIcon, label: 'LinkedIn' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((c) => (
            <div key={c.title}>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {c.title}
              </div>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-zinc-400 transition hover:text-white"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row">
          <div className="font-mono text-[11px] text-zinc-500">
            © {new Date().getFullYear()} Vaultline Labs · All rights reserved
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] text-zinc-500">
            <a href="#" className="hover:text-zinc-300">Privacy</a>
            <a href="#" className="hover:text-zinc-300">Terms</a>
            <a href="#" className="hover:text-zinc-300">Cookies</a>
            <a href="#" className="hover:text-zinc-300">Risk disclosures</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
