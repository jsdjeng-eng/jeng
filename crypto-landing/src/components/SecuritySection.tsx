import { motion } from 'framer-motion'
import {
  Snowflake,
  KeyRound,
  Fingerprint,
  ShieldCheck,
  Umbrella,
  Lock,
  Eye,
  AlertOctagon,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Snowflake,
    title: '95% Cold Storage',
    desc: 'Funds held in geographically distributed, air-gapped HSMs. Hot wallets capped at insured limits.',
    color: '#22d3ee',
  },
  {
    icon: KeyRound,
    title: 'Multi-Signature Vaults',
    desc: '3-of-5 threshold signing across independent quorums. No single key, no single point of failure.',
    color: '#8b5cf6',
  },
  {
    icon: Fingerprint,
    title: 'Biometric + Hardware 2FA',
    desc: 'FIDO2 passkeys, YubiKey, and Face ID. Phishing-resistant by design — passwords are optional.',
    color: '#34d399',
  },
  {
    icon: ShieldCheck,
    title: 'SOC 2 Type II + ISO 27001',
    desc: 'Continuously audited by Trail of Bits, OpenZeppelin, and Halborn. Quarterly proof-of-reserves.',
    color: '#f472b6',
  },
  {
    icon: Umbrella,
    title: '$350M Insurance Pool',
    desc: 'Lloyd\u2019s-syndicated coverage on custodial assets, plus an on-chain mutual for smart-contract risk.',
    color: '#fb923c',
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    desc: 'AES-256-GCM at rest, TLS 1.3 in transit, and zero-knowledge metadata. We can\u2019t read what we don\u2019t see.',
    color: '#60a5fa',
  },
]

const TIMELINE = [
  { icon: Eye, label: 'Threat detected', sub: 'Anomalous withdrawal pattern' },
  { icon: AlertOctagon, label: 'Auto-freeze', sub: '< 80ms response' },
  { icon: ShieldCheck, label: 'Quorum review', sub: '3-of-5 sign-off' },
  { icon: Lock, label: 'Funds restored', sub: 'Zero loss' },
]

export function SecuritySection() {
  return (
    <section id="security" className="relative py-24 sm:py-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/5 px-3 py-1 text-xs font-medium text-violet-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Security posture
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            <span className="text-gradient">Defense in depth.</span>
            <br />
            Engineered for the long tail.
          </h2>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            Six independent layers of cryptographic, operational, and
            financial controls — so a single failure can never compromise your
            assets.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group glass relative overflow-hidden rounded-2xl p-6 transition hover:-translate-y-0.5 hover:bg-white/[0.07]"
            >
              <div
                className="pointer-events-none absolute -top-px -right-px h-24 w-24 rounded-bl-full opacity-30 blur-2xl transition group-hover:opacity-60"
                style={{ background: f.color }}
              />
              <div
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/10"
                style={{
                  background: `linear-gradient(135deg, ${f.color}33, ${f.color}11)`,
                  boxShadow: `inset 0 0 0 1px ${f.color}22`,
                }}
              >
                <f.icon className="h-5 w-5" style={{ color: f.color }} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Incident response timeline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="glass-strong mt-12 overflow-hidden rounded-2xl"
        >
          <div className="flex flex-col items-start justify-between gap-4 border-b border-white/5 px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Live incident response
              </div>
              <div className="mt-1 text-base font-semibold text-white">
                Sub-second auto-freeze pipeline
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-mono text-[11px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              All systems operational · 99.999% SLA
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/5 md:grid-cols-4">
            {TIMELINE.map((t, i) => (
              <div
                key={t.label}
                className="relative flex flex-col gap-3 bg-ink-900/80 px-5 py-6"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-md border border-white/10 bg-white/5 font-mono text-[11px] font-semibold text-zinc-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <t.icon className="h-4 w-4 text-cyan-300" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {t.label}
                  </div>
                  <div className="mt-0.5 text-[12px] text-zinc-400">{t.sub}</div>
                </div>
                {i < TIMELINE.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden h-px w-6 -translate-y-1/2 translate-x-1/2 bg-gradient-to-r from-cyan-400/60 to-transparent md:block" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
