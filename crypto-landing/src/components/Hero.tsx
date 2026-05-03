import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { COINS } from '../data/coins'
import { CoinIcon } from './CoinIcon'
import { useLivePrice } from '../hooks/useLivePrice'
import { Sparkline } from './Sparkline'

function FloatingCard({
  coin,
  index,
  className,
  delay,
}: {
  coin: (typeof COINS)[number]
  index: number
  className: string
  delay: number
}) {
  const { history, current, changePct } = useLivePrice(
    coin.basePrice,
    coin.volatility,
    index * 53 + 7,
    2200,
  )
  const up = changePct >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={`glass-strong absolute hidden w-64 rounded-2xl p-4 md:block ${className}`}
      style={{ animation: `float 6s ease-in-out ${delay}s infinite` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CoinIcon symbol={coin.symbol} color={coin.color} size={32} />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">{coin.symbol}</div>
            <div className="text-[11px] text-zinc-400">{coin.name}</div>
          </div>
        </div>
        <span
          className={`font-mono text-[11px] font-semibold tabular-nums ${
            up ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {up ? '+' : ''}
          {changePct.toFixed(2)}%
        </span>
      </div>
      <div className="mt-3 font-mono text-xl font-semibold tabular-nums text-white">
        $
        {current.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
      <Sparkline
        data={history}
        color={up ? '#34d399' : '#fb7185'}
        height={42}
        className="mt-1"
      />
    </motion.div>
  )
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-28">
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 grid-bg [mask-image:radial-gradient(ellipse_at_top,#000_30%,transparent_75%)]" />
      <div className="absolute inset-0 -z-10 radial-glow" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-br from-cyan-500/20 via-violet-500/15 to-fuchsia-500/10 blur-3xl" />

      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="relative">
          <div className="relative mx-auto max-w-3xl text-center">
            <motion.a
              href="#"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-200"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span className="text-zinc-300">
                Now live: Institutional Vaults v3
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
            </motion.a>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-6 text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl md:text-7xl"
            >
              <span className="text-gradient">Self-custody crypto,</span>
              <br />
              <span className="shine-text">built like a vault.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg"
            >
              Trade, stake, and store digital assets with bank-grade
              encryption, multi-signature controls, and audited cold storage.
              No middlemen. No surprises. Your keys, your control.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <button
                type="button"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3.5 text-sm font-semibold text-ink-950 shadow-xl shadow-violet-500/30 transition hover:shadow-violet-500/60"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Open a Vault</span>
                <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                View security audits
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-4"
            >
              {[
                { v: '$24.6B+', l: 'Assets secured' },
                { v: '4.2M', l: 'Active wallets' },
                { v: '99.999%', l: 'Uptime SLA' },
                { v: '0', l: 'Funds lost since 2019' },
              ].map((s) => (
                <div
                  key={s.l}
                  className="bg-ink-900/80 px-4 py-5 backdrop-blur"
                >
                  <div className="font-mono text-xl font-semibold text-white sm:text-2xl">
                    {s.v}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-zinc-400">
                    {s.l}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Floating preview cards (decorative, hidden on mobile) */}
          <FloatingCard
            coin={COINS[0]}
            index={0}
            delay={0.6}
            className="left-[-2%] top-32 rotate-[-6deg] xl:left-[-4%]"
          />
          <FloatingCard
            coin={COINS[2]}
            index={2}
            delay={1.4}
            className="right-[-2%] top-24 rotate-[7deg] xl:right-[-4%]"
          />
        </div>
      </div>
    </section>
  )
}
