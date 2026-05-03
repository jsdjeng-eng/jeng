import { motion } from 'framer-motion'
import { ArrowRight, BarChart3 } from 'lucide-react'
import { COINS } from '../data/coins'
import { CoinIcon } from './CoinIcon'
import { useLivePrice } from '../hooks/useLivePrice'
import { Sparkline } from './Sparkline'

function formatPrice(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function MarketCard({
  coin,
  index,
}: {
  coin: (typeof COINS)[number]
  index: number
}) {
  const { history, current, change, changePct } = useLivePrice(
    coin.basePrice,
    coin.volatility,
    index * 71 + 3,
    1700,
  )
  const up = changePct >= 0
  const lineColor = up ? '#34d399' : '#fb7185'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group glass relative overflow-hidden rounded-2xl p-5 transition hover:bg-white/[0.07]"
    >
      <div
        className="pointer-events-none absolute -inset-px -z-10 rounded-2xl opacity-0 transition group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at var(--mx,50%) var(--my,0%), ${coin.color}22, transparent 60%)`,
        }}
      />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <CoinIcon symbol={coin.symbol} color={coin.color} size={40} />
          <div>
            <div className="text-base font-semibold text-white">
              {coin.symbol}
              <span className="ml-2 text-xs font-normal text-zinc-500">
                {coin.name}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Live
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-xl font-semibold tabular-nums text-white">
            ${formatPrice(current)}
          </div>
          <div
            className={`mt-0.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums ${
              up
                ? 'bg-emerald-500/15 text-emerald-300'
                : 'bg-rose-500/15 text-rose-300'
            }`}
          >
            {up ? '▲' : '▼'} {Math.abs(changePct).toFixed(2)}%
            <span className="text-zinc-500">·</span>
            <span className={up ? 'text-emerald-300' : 'text-rose-300'}>
              {up ? '+' : ''}
              {change.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <Sparkline data={history} color={lineColor} height={68} className="mt-4" />
      <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/5 text-[11px]">
        <div className="bg-white/[0.02] px-3 py-2">
          <div className="text-zinc-500">Mkt Cap</div>
          <div className="mt-0.5 font-mono text-zinc-200">{coin.marketCap}</div>
        </div>
        <div className="bg-white/[0.02] px-3 py-2">
          <div className="text-zinc-500">24h Vol</div>
          <div className="mt-0.5 font-mono text-zinc-200">{coin.volume}</div>
        </div>
      </div>
    </motion.div>
  )
}

export function MarketsSection() {
  return (
    <section id="markets" className="relative py-24 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-medium text-cyan-300">
              <BarChart3 className="h-3.5 w-3.5" />
              Live markets
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              <span className="text-gradient">Real-time prices</span>, audited
              feeds.
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              Pricing aggregated from 14 venues with sub-second median latency
              and Chainlink + Pyth oracle redundancy. Charts update live as you
              read.
            </p>
          </div>
          <a
            href="#"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
          >
            View all 320+ assets
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COINS.map((c, i) => (
            <MarketCard key={c.symbol} coin={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
