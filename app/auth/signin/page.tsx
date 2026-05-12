"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import { signIn } from "@/lib/auth-client";
import { validateEmail } from "@/lib/email-validation";
import { cn } from "@/lib/utils";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;
const STORAGE_KEY = "jeng-signin-attempts";

type AttemptState = {
  failed: number;
  lockedUntil: number | null;
};

const INITIAL_STATE: AttemptState = { failed: 0, lockedUntil: null };

function loadAttempts(): AttemptState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as AttemptState;
    if (
      typeof parsed?.failed === "number" &&
      (parsed.lockedUntil === null || typeof parsed.lockedUntil === "number")
    ) {
      return parsed;
    }
    return INITIAL_STATE;
  } catch {
    return INITIAL_STATE;
  }
}

function saveAttempts(state: AttemptState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* sessionStorage unavailable */
  }
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInSkeleton />}>
      <SignInForm />
    </Suspense>
  );
}

function SignInSkeleton() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="h-72 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
      </div>
    </main>
  );
}

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const verified = params.get("verified") === "true";
  const redirectTarget = params.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<AttemptState>(INITIAL_STATE);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Hydrate from sessionStorage after mount - SSR can't read browser storage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttempts(loadAttempts());
  }, []);

  // Update "now" every second while a lockout is active so the countdown ticks.
  useEffect(() => {
    if (!attempts.lockedUntil || attempts.lockedUntil <= Date.now()) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [attempts.lockedUntil]);

  const lockoutRemaining = useMemo(() => {
    if (!attempts.lockedUntil) return 0;
    return Math.max(0, Math.ceil((attempts.lockedUntil - now) / 1000));
  }, [attempts.lockedUntil, now]);

  // Clear lockout when timer hits zero.
  useEffect(() => {
    if (attempts.lockedUntil && lockoutRemaining === 0) {
      const next: AttemptState = { failed: 0, lockedUntil: null };
      // Resetting derived lockout state once the deadline passes is the
      // documented synchronisation pattern for time-based UI.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAttempts(next);
      saveAttempts(next);
    }
  }, [attempts.lockedUntil, lockoutRemaining]);

  const emailState = useMemo(() => {
    if (!email) return { state: "idle" as const };
    const result = validateEmail(email);
    return result.valid
      ? { state: "valid" as const }
      : { state: "invalid" as const, reason: result.reason };
  }, [email]);

  const isLocked = lockoutRemaining > 0;
  const canSubmit =
    !submitting &&
    !isLocked &&
    emailState.state === "valid" &&
    password.length >= 1;

  const registerFailedAttempt = useCallback(() => {
    setAttempts((prev) => {
      const failed = prev.failed + 1;
      const reachedLimit = failed >= MAX_ATTEMPTS;
      const next: AttemptState = {
        failed: reachedLimit ? 0 : failed,
        lockedUntil: reachedLimit ? Date.now() + LOCKOUT_SECONDS * 1000 : null,
      };
      saveAttempts(next);
      return next;
    });
  }, []);

  const clearAttempts = useCallback(() => {
    const next = INITIAL_STATE;
    setAttempts(next);
    saveAttempts(next);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const { error: signInError } = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        const code = signInError.code ?? "";
        const status = signInError.status ?? 0;

        if (code === "EMAIL_NOT_VERIFIED" || status === 403) {
          router.push("/auth/verify-email");
          return;
        }

        if (status === 429) {
          setError("Too many requests. Please slow down and try again shortly.");
          return;
        }

        // Treat any other 401-style error as a bad credential and consume an attempt.
        registerFailedAttempt();
        setError(signInError.message ?? "Invalid email or password.");
        return;
      }

      clearAttempts();
      router.push(redirectTarget);
      router.refresh();
    } catch (err) {
      registerFailedAttempt();
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    if (isLocked) return;
    setError(null);
    setSubmitting(true);
    try {
      await signIn.social({ provider: "google", callbackURL: redirectTarget });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start Google sign in.");
      setSubmitting(false);
    }
  }

  const remaining = MAX_ATTEMPTS - attempts.failed;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Sign in to continue to Jeng.
          </p>
        </div>

        {verified && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>Your email is verified. You can now sign in.</span>
          </div>
        )}

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting || isLocked}
                placeholder="you@example.com"
                className={cn(
                  "h-11 w-full rounded-lg border border-zinc-200 bg-white px-10 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-white dark:focus:ring-white/10",
                  emailState.state === "valid" && "ring-1 ring-emerald-500/40",
                  emailState.state === "invalid" && "ring-1 ring-red-500/40",
                )}
                required
              />
              {emailState.state === "valid" && (
                <CheckCircle2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
              )}
              {emailState.state === "invalid" && (
                <XCircle className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
              )}
            </div>

            <div className="flex items-baseline justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting || isLocked}
                placeholder="Your password"
                className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-10 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-white dark:focus:ring-white/10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <AttemptsIndicator failed={attempts.failed} />

            {isLocked && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
                <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>
                  Too many failed attempts. Try again in{" "}
                  <strong>{lockoutRemaining}s</strong>.
                </span>
              </div>
            )}

            {error && !isLocked && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>
                  {error}{" "}
                  {!isLocked && remaining < MAX_ATTEMPTS && (
                    <span className="opacity-80">
                      ({remaining} attempt{remaining === 1 ? "" : "s"} left)
                    </span>
                  )}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
            <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            <span>or</span>
            <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={submitting || isLocked}
            className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-full border border-zinc-200 bg-white text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          New to Jeng?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-zinc-900 underline-offset-4 hover:underline dark:text-white"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

function AttemptsIndicator({ failed }: { failed: number }) {
  if (failed === 0) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
      <span>Remaining attempts</span>
      <div className="flex items-center gap-1">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, idx) => (
          <span
            key={idx}
            className={cn(
              "h-1.5 w-4 rounded-full",
              idx < MAX_ATTEMPTS - failed
                ? "bg-zinc-900 dark:bg-white"
                : "bg-zinc-200 dark:bg-zinc-700",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.717v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.892 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
