export type Coin = {
  symbol: string
  name: string
  basePrice: number
  volatility: number
  color: string
  iconBg: string
  marketCap: string
  volume: string
}

export const COINS: Coin[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    basePrice: 67_842.21,
    volatility: 0.004,
    color: '#f7931a',
    iconBg: 'from-orange-400/30 to-orange-500/10',
    marketCap: '$1.34T',
    volume: '$28.4B',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    basePrice: 3_478.55,
    volatility: 0.006,
    color: '#8a92b2',
    iconBg: 'from-indigo-400/30 to-indigo-500/10',
    marketCap: '$418B',
    volume: '$14.1B',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    basePrice: 178.32,
    volatility: 0.012,
    color: '#9945ff',
    iconBg: 'from-violet-400/30 to-fuchsia-500/10',
    marketCap: '$83.2B',
    volume: '$3.6B',
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    basePrice: 42.18,
    volatility: 0.014,
    color: '#e84142',
    iconBg: 'from-rose-400/30 to-red-500/10',
    marketCap: '$16.4B',
    volume: '$612M',
  },
]
