"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Inbox,
  Loader2,
  LogOut,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { signOut, useSession } from "@/lib/auth-client";

const POLL_MS = 8000;
const SUCCESS_REDIRECT_MS = 2200;

type ResendState = "idle" | "sending" | "sent" | "error";

export default function VerifyEmailPage() {
  const router = useRouter();
  const session = useSession();

  const [verified, setVerified] = useState(false);
  const [resendState, setResendState] = useState<ResendState>("idle");
  const [resendError, setResendError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const lockRef = useRef(false);

  const user = session.data?.user;
  const userEmail = user?.email ?? "";

  // If proxy.ts let the user reach this page without a session, send them
  // back to sign-in.
  useEffect(() => {
    if (session.isPending) return;
    if (!session.data?.user) {
      router.replace("/auth/signin");
    }
  }, [session.isPending, session.data, router]);

  // Lock the back button so users can't dodge the verify-email gate.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (lockRef.current) return;
    lockRef.current = true;
    window.history.pushState(null, "", window.location.href);
    const onPop = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Poll session for emailVerified flip.
  useEffect(() => {
    if (verified) return;
    const id = setInterval(() => {
      session.refetch();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [session, verified]);

  // Detect verification.
  useEffect(() => {
    if (verified) return;
    if (session.data?.user?.emailVerified) {
      // Latch the verified flag once - this drives the success animation effect
      // below as well as the redirect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVerified(true);
    }
  }, [session.data, verified]);

  // Success animation + auto redirect.
  useEffect(() => {
    if (!verified) return;
    // Reset progress whenever the success state is (re-)entered.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(0);
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / SUCCESS_REDIRECT_MS) * 100));
      setProgress(pct);
      if (elapsed >= SUCCESS_REDIRECT_MS) {
        clearInterval(tick);
        router.replace("/auth/signin?verified=true");
      }
    }, 80);
    return () => clearInterval(tick);
  }, [verified, router]);

  const resend = useCallback(async () => {
    if (!userEmail) return;
    setResendError(null);
    setResendState("sending");
    try {
      const res = await fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: userEmail, callbackURL: "/auth/verify-email" }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(data?.message ?? "Could not resend verification email.");
      }
      setResendState("sent");
      setTimeout(() => setResendState("idle"), 4000);
    } catch (err) {
      setResendError(err instanceof Error ? err.message : "Network error");
      setResendState("error");
    }
  }, [userEmail]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace("/auth/signin");
  }, [router]);

  if (session.isPending) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </main>
    );
  }

  if (verified) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md animate-fade-in rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900/60 dark:bg-emerald-950/30">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
            Email verified
          </h1>
          <p className="mt-2 text-sm text-emerald-800/80 dark:text-emerald-200/80">
            Great - your email is confirmed. Redirecting you to sign in...
          </p>
          <div className="mx-auto mt-6 h-2 w-full overflow-hidden rounded-full bg-emerald-200/60 dark:bg-emerald-900/40">
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width] duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl animate-fade-in">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Check your inbox
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                We sent a verification link to{" "}
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white">
                  <Mail className="h-3 w-3" />
                  {userEmail || "your email"}
                </span>
              </p>
            </div>
          </div>

          <ol className="space-y-3 text-sm">
            <Step number={1} title="Open the email">
              <Inbox className="h-4 w-4 text-zinc-500" />
              Find our message - check spam if you don&apos;t see it.
            </Step>
            <Step number={2} title="Click verify">
              <CheckCircle2 className="h-4 w-4 text-zinc-500" />
              Tap the &ldquo;Verify my email&rdquo; button.
            </Step>
            <Step number={3} title="Come back here">
              <ShieldCheck className="h-4 w-4 text-zinc-500" />
              This page will detect it automatically.
            </Step>
          </ol>

          <div className="mt-8 flex items-center gap-2 rounded-full bg-zinc-50 px-4 py-2 text-xs text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-700 dark:bg-zinc-200" />
            </span>
            Watching for verification...
          </div>

          {resendState === "sent" && (
            <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
              Verification email re-sent. Please check your inbox again.
            </p>
          )}
          {resendState === "error" && resendError && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              {resendError}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={resend}
              disabled={resendState === "sending"}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
            >
              {resendState === "sending" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Resend verification email
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">
        {number}
      </span>
      <div>
        <p className="font-medium text-zinc-900 dark:text-white">{title}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
          {children}
        </p>
      </div>
    </li>
  );
}
