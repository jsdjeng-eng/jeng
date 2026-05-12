import {
  ArrowUpRight,
  Database,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { HeroButtons } from "@/components/HeroButtons";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800/80">
        {/* decorative gradient blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-100 to-transparent blur-3xl dark:from-zinc-800 dark:via-zinc-900"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-zinc-200 via-zinc-100 to-transparent blur-3xl dark:from-zinc-800 dark:via-zinc-900"
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-24 text-center sm:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-zinc-700 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
            <Sparkles className="h-3.5 w-3.5" />
            Better Auth + Firestore + Resend
            <span className="text-zinc-400">·</span>
            <span className="text-zinc-500 dark:text-zinc-400">v0.1.0</span>
          </div>

          <h1 className="max-w-3xl bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-5xl font-semibold leading-[1.05] tracking-tight text-transparent dark:from-white dark:via-zinc-200 dark:to-white sm:text-6xl">
            Authentication that just works.
            <br />
            <span className="text-zinc-400 dark:text-zinc-500">
              From sign-up to dashboard in minutes.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            Jeng pairs Better Auth, Firestore, and Resend with a polished Next.js
            16 starter. Email & password, Google OAuth, verification flows, and
            route protection are wired up - so you can build your product.
          </p>

          <div className="mt-10">
            <HeroButtons />
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            <span>Next.js 16</span>
            <span className="hidden sm:inline">·</span>
            <span>React 19</span>
            <span className="hidden sm:inline">·</span>
            <span>Tailwind v4</span>
            <span className="hidden sm:inline">·</span>
            <span>Firestore</span>
            <span className="hidden sm:inline">·</span>
            <span>Resend</span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
        <div className="mb-14 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
            Why Jeng
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            A modern auth stack, already wired up.
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Skip the boilerplate. Every piece below is implemented and ready to
            ship the moment you drop in your environment variables.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Email & password"
            description="8-128 char passwords, server-side validation, secure cookies, rate limiting, and brute-force protection out of the box."
          />
          <Feature
            icon={<Mail className="h-5 w-5" />}
            title="Verification flow"
            description="Beautiful Resend-powered emails with a polling verify page, auto-redirect, and a back-button lock so users can't slip past the gate."
          />
          <Feature
            icon={<Lock className="h-5 w-5" />}
            title="Google OAuth"
            description="One-click Google sign in with account linking, so users can mix social and password logins without creating duplicates."
          />
          <Feature
            icon={<Database className="h-5 w-5" />}
            title="Firestore storage"
            description="Better Auth talks to Firestore via the Admin SDK. Sessions, users, accounts, and verifications all persist server-side."
          />
          <Feature
            icon={<Zap className="h-5 w-5" />}
            title="Edge proxy"
            description="Next.js 16 proxy.ts protects /dashboard, gates verification, and bounces signed-in users away from /auth pages."
          />
          <Feature
            icon={<ArrowUpRight className="h-5 w-5" />}
            title="Production ready"
            description="Tailwind v4 design tokens, dark mode, App Router conventions, and TypeScript strict mode. Ship to Vercel in one click."
          />
        </div>
      </section>

      <section className="border-t border-zinc-200/80 bg-zinc-50/60 dark:border-zinc-800/80 dark:bg-zinc-950/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              Ready to start?
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Create an account and explore the dashboard.
            </p>
          </div>
          <HeroButtons />
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-white transition group-hover:scale-105 dark:bg-white dark:text-zinc-900">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}
