import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export function CTA() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="glass-strong relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16"
        >
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_70%)]" />
          <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-fuchsia-500/20 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
              No-cost onboarding · Cancel anytime
            </div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              <span className="text-gradient">
                Take custody of your crypto
              </span>
              <br />
              in under 90 seconds.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-300 sm:text-base">
              Connect your wallet, verify your identity, and open a vault.
              Your assets are insured the moment they arrive.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3.5 text-sm font-semibold text-ink-950 shadow-xl shadow-violet-500/40 transition hover:shadow-violet-500/60"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Open a vault</span>
                <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Talk to our security team
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-zinc-500">
              <span>SOC 2 Type II</span>
              <span className="h-1 w-1 rounded-full bg-zinc-700" />
              <span>ISO 27001</span>
              <span className="h-1 w-1 rounded-full bg-zinc-700" />
              <span>$350M insured</span>
              <span className="h-1 w-1 rounded-full bg-zinc-700" />
              <span>Audited by 6 firms</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
