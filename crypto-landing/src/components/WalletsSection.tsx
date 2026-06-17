import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Wallet } from 'lucide-react'

type WalletInfo = {
  name: string
  glyph: string
  color: string
  type: string
}

const WALLETS: WalletInfo[] = [
  { name: 'MetaMask', glyph: '🦊', color: '#f6851b', type: 'Browser' },
  { name: 'WalletConnect', glyph: '◍', color: '#3b99fc', type: 'Protocol' },
  { name: 'Coinbase', glyph: '⌬', color: '#1652f0', type: 'Exchange' },
  { name: 'Phantom', glyph: '👻', color: '#ab9ff2', type: 'Solana' },
  { name: 'Trust', glyph: '🛡', color: '#3375bb', type: 'Mobile' },
  { name: 'Ledger', glyph: '▣', color: '#000000', type: 'Hardware' },
  { name: 'Trezor', glyph: '◆', color: '#1d1d1f', type: 'Hardware' },
  { name: 'Rabby', glyph: '⚡', color: '#7084ff', type: 'Browser' },
]

const STEPS = [
  {
    n: '01',
    title: 'Connect any wallet',
    desc: '80+ wallets supported across EVM, Solana, Cosmos, Bitcoin, and more. One-click pairing — no seed phrases ever transmitted.',
    accent: '#22d3ee',
  },
  {
    n: '02',
    title: 'Sign with hardware',
    desc: 'Ledger and Trezor signing with clear-text transaction previews. Every action is verified on-device.',
    accent: '#8b5cf6',
  },
  {
    n: '03',
    title: 'Trade & earn',
    desc: 'Spot, perps, staking, and lending — all from your wallet. Vaultline never holds your private keys.',
    accent: '#34d399',
  },
]

function WalletLogo({ wallet }: { wallet: WalletInfo }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      className="group glass relative flex flex-col items-center justify-center gap-2 rounded-xl px-3 py-5 transition hover:bg-white/[0.07]"
    >
      <div
        className="grid h-12 w-12 place-items-center rounded-xl text-xl"
        style={{
          background: `linear-gradient(135deg, ${wallet.color}33, ${wallet.color}11)`,
          boxShadow: `inset 0 0 0 1px ${wallet.color}33`,
        }}
      >
        <span aria-hidden="true">{wallet.glyph}</span>
      </div>
      <div className="text-sm font-medium text-white">{wallet.name}</div>
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">
        {wallet.type}
      </div>
      <CheckCircle2
        className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-emerald-400/0 transition group-hover:text-emerald-400"
        aria-hidden="true"
      />
    </motion.button>
  )
}

export function WalletsSection() {
  return (
    <section id="wallets" className="relative py-24 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-medium text-emerald-300">
              <Wallet className="h-3.5 w-3.5" />
              Wallet integrations
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              <span className="text-gradient">Bring your wallet.</span>
              <br />
              Keep your keys.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Vaultline is fully non-custodial. We integrate with every major
              wallet and hardware device — your private keys never leave your
              control. Sign once, transact everywhere.
            </p>

            <ul className="mt-8 space-y-5">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg font-mono text-xs font-semibold"
                    style={{
                      color: s.accent,
                      background: `linear-gradient(135deg, ${s.accent}22, ${s.accent}06)`,
                      boxShadow: `inset 0 0 0 1px ${s.accent}33`,
                    }}
                  >
                    {s.n}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {s.title}
                    </div>
                    <div className="mt-1 text-sm leading-relaxed text-zinc-400">
                      {s.desc}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-zinc-100"
              >
                Connect wallet
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                See integration docs
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="glass-strong relative overflow-hidden rounded-3xl p-5 sm:p-7">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Connect a wallet
                  </div>
                  <div className="mt-1 text-base font-semibold text-white">
                    80+ supported · non-custodial
                  </div>
                </div>
                <div className="flex h-8 items-center gap-1.5 rounded-full border border-white/10 px-2.5 font-mono text-[11px] text-zinc-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Encrypted
                </div>
              </div>

              <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {WALLETS.map((w) => (
                  <WalletLogo key={w.name} wallet={w} />
                ))}
              </div>

              <div className="relative mt-6 flex items-center justify-between rounded-xl border border-white/5 bg-black/40 px-4 py-3 font-mono text-[11px] text-zinc-400">
                <span>connection.status</span>
                <span className="text-emerald-300">
                  ready · WalletConnect v2 · TLS 1.3
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
