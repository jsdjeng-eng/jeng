import { useEffect, useRef, useState } from 'react'

const HISTORY_LENGTH = 48

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function buildInitialHistory(base: number, volatility: number, seed: number) {
  const rand = seededRandom(seed)
  const history: number[] = []
  let price = base * (1 - volatility * 6)
  for (let i = 0; i < HISTORY_LENGTH; i++) {
    const drift = (rand() - 0.45) * volatility * base
    price = Math.max(price + drift, base * 0.7)
    history.push(price)
  }
  // Nudge final value toward base so opening "current" matches.
  history[history.length - 1] = base
  return history
}

export function useLivePrice(
  basePrice: number,
  volatility: number,
  seed: number,
  intervalMs = 1500,
) {
  const [history, setHistory] = useState<number[]>(() =>
    buildInitialHistory(basePrice, volatility, seed),
  )
  const lastRef = useRef(basePrice)

  useEffect(() => {
    const id = setInterval(() => {
      setHistory((prev) => {
        const last = prev[prev.length - 1] ?? basePrice
        const drift = (Math.random() - 0.5) * volatility * basePrice * 1.6
        const meanReversion = (basePrice - last) * 0.04
        const next = Math.max(last + drift + meanReversion, basePrice * 0.7)
        lastRef.current = next
        const nextHistory = [...prev.slice(1), next]
        return nextHistory
      })
    }, intervalMs)
    return () => clearInterval(id)
  }, [basePrice, volatility, intervalMs])

  const current = history[history.length - 1] ?? basePrice
  const opening = history[0] ?? basePrice
  const change = current - opening
  const changePct = (change / opening) * 100

  return { history, current, change, changePct }
}
