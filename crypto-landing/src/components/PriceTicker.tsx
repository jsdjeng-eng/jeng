import { useLivePrice } from '../hooks/useLivePrice'
import { COINS } from '../data/coins'
import { CoinIcon } from './CoinIcon'

function TickerItem({
  coin,
  index,
}: {
  coin: (typeof COINS)[number]
  index: number
}) {
  const { current, changePct } = useLivePrice(
    coin.basePrice,
    coin.volatility,
    index * 137 + 11,
    2400,
  )
  const up = changePct >= 0
  return (
    <div className="flex shrink-0 items-center gap-2.5 px-5 py-1">
      <CoinIcon symbol={coin.symbol} color={coin.color} size={22} />
      <span className="font-mono text-[13px] font-medium text-zinc-200">
        {coin.symbol}
      </span>
      <span className="font-mono text-[13px] tabular-nums text-zinc-100">
        $
        {current.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
      <span
        className={`font-mono text-[12px] tabular-nums ${
          up ? 'text-emerald-400' : 'text-rose-400'
        }`}
      >
        {up ? '▲' : '▼'} {Math.abs(changePct).toFixed(2)}%
      </span>
      <span className="text-zinc-700">·</span>
    </div>
  )
}

const EXTRAS = [
  { symbol: 'USDC', name: 'USD Coin', basePrice: 1.0001, volatility: 0.0002, color: '#2775ca' },
  { symbol: 'LINK', name: 'Chainlink', basePrice: 18.42, volatility: 0.014, color: '#2a5ada' },
  { symbol: 'ARB', name: 'Arbitrum', basePrice: 1.21, volatility: 0.018, color: '#28a0f0' },
  { symbol: 'OP', name: 'Optimism', basePrice: 2.84, volatility: 0.018, color: '#ff0420' },
  { symbol: 'MATIC', name: 'Polygon', basePrice: 0.91, volatility: 0.02, color: '#8247e5' },
] as const

export function PriceTicker() {
  const all = [
    ...COINS.map((c, i) => ({ ...c, _i: i })),
    ...EXTRAS.map((c, i) => ({
      ...c,
      iconBg: '',
      marketCap: '',
      volume: '',
      _i: i + 10,
    })),
  ]
  // Duplicate for a seamless loop.
  const loop = [...all, ...all]
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-black/40 py-2 backdrop-blur">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent" />
      <div className="flex w-max animate-marquee">
        {loop.map((c, idx) => (
          <TickerItem key={`${c.symbol}-${idx}`} coin={c as never} index={c._i} />
        ))}
      </div>
    </div>
  )
}
