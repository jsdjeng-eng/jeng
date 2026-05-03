type Props = {
  symbol: string
  color: string
  size?: number
  className?: string
}

export function CoinIcon({ symbol, color, size = 36, className = '' }: Props) {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full font-bold text-white ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}cc, ${color}55 55%, ${color}11)`,
        boxShadow: `0 0 18px ${color}55, inset 0 1px 0 rgba(255,255,255,0.15)`,
        fontSize: size * 0.36,
        letterSpacing: '0.02em',
      }}
    >
      {symbol.slice(0, 3)}
    </div>
  )
}
