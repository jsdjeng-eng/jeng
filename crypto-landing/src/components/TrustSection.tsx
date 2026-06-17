import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, FileCheck2, Quote, Star } from 'lucide-react'

const STATS = [
  { value: 24.6, prefix: '$', suffix: 'B+', label: 'Assets under custody' },
  { value: 4.2, prefix: '', suffix: 'M', label: 'Verified accounts' },
  { value: 197, prefix: '', suffix: '', label: 'Countries served' },
  { value: 100, prefix: '', suffix: '%', label: 'Proof-of-reserves' },
]

const AUDITORS = [
  'Trail of Bits',
  'OpenZeppelin',
  'Halborn',
  'Quantstamp',
  'CertiK',
  'Spearbit',
]

const PRESS = ['Bloomberg', 'CoinDesk', 'TechCrunch', 'The Block', 'WSJ', 'Forbes']

const TESTIMONIALS = [
  {
    quote:
      'Vaultline is the first crypto platform we audited where we could find no critical findings on the custody layer. Their multi-sig architecture is genuinely thoughtful.',
    author: 'Aisha Khan',
    role: 'Lead Auditor, Trail of Bits',
    avatar: 'AK',
    accent: '#22d3ee',
  },
  {
    quote:
      'We moved $180M in treasury assets to Vaultline. Eight months later — institutional reporting, hardware sign-off, zero incidents. It just works.',
    author: 'Marco Bellini',
    role: 'CFO, Helio Capital',
    avatar: 'MB',
    accent: '#8b5cf6',
  },
  {
    quote:
      'The biometric flow + Ledger handoff is the smoothest custody UX I\u2019ve used. My team was onboarded in under 12 minutes — without compromising on security.',
    author: 'Yuki Tanaka',
    role: 'Head of Crypto, Norwell',
    avatar: 'YT',
    accent: '#34d399',
  },
]

function CountUp({
  to,
  prefix,
  suffix,
}: {
  to: number
  prefix: string
  suffix: string
}) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const start = performance.now()
          const dur = 1400
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / dur)
            const eased = 1 - Math.pow(1 - t, 3)
            setVal(to * eased)
            if (t < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          obs.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [to])

  const decimals = to % 1 !== 0 ? 1 : 0
  return (
    <div ref={ref} className="font-mono text-3xl font-semibold tabular-nums text-white sm:text-4xl">
      {prefix}
      {val.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </div>
  )
}

export function TrustSection() {
  return (
    <section id="trust" className="relative py-24 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1 text-xs font-medium text-amber-300">
            <Award className="h-3.5 w-3.5" />
            Trust & verification
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            <span className="text-gradient">Trusted by funds.</span>{' '}
            Audited in the open.
          </h2>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            Independently verified. Continuously monitored. Publicly
            accountable.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-ink-900/80 px-5 py-7">
              <CountUp to={s.value} prefix={s.prefix} suffix={s.suffix} />
              <div className="mt-2 text-[12px] uppercase tracking-wider text-zinc-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Auditors / Press */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
              <FileCheck2 className="h-3.5 w-3.5" />
              Audited by
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-3">
              {AUDITORS.map((a) => (
                <div
                  key={a}
                  className="flex h-12 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] font-mono text-[12px] font-medium tracking-wider text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {a}
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
              <Star className="h-3.5 w-3.5" />
              As featured in
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {PRESS.map((p) => (
                <div
                  key={p}
                  className="flex h-12 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] font-serif text-[14px] tracking-wide text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass relative flex h-full flex-col rounded-2xl p-6"
            >
              <Quote
                className="h-6 w-6 opacity-40"
                style={{ color: t.accent }}
              />
              <blockquote className="mt-3 grow text-sm leading-relaxed text-zinc-200">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4">
                <div
                  className="grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${t.accent}55, ${t.accent}11)`,
                    boxShadow: `inset 0 0 0 1px ${t.accent}55`,
                  }}
                >
                  {t.avatar}
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-white">
                    {t.author}
                  </div>
                  <div className="text-xs text-zinc-400">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
