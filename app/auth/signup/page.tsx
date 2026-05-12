"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  XCircle,
} from "lucide-react";

import { signIn, signUp } from "@/lib/auth-client";
import { validateEmail } from "@/lib/email-validation";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailState = useMemo(() => {
    if (!email) return { state: "idle" as const };
    const result = validateEmail(email);
    return result.valid
      ? { state: "valid" as const }
      : { state: "invalid" as const, reason: result.reason };
  }, [email]);

  const passwordIssues = useMemo(() => {
    const issues: string[] = [];
    if (password.length > 0 && password.length < 8) {
      issues.push("Must be at least 8 characters.");
    }
    return issues;
  }, [password]);

  const canSubmit =
    !submitting &&
    name.trim().length >= 2 &&
    emailState.state === "valid" &&
    password.length >= 8 &&
    password.length <= 128;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const { error: signUpError } = await signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      if (signUpError) {
        setError(signUpError.message ?? "Could not create your account.");
        return;
      }
      router.push("/auth/verify-email");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setSubmitting(true);
    try {
      await signIn.social({ provider: "google", callbackURL: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start Google sign in.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Join Jeng - it only takes a minute.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FieldLabel htmlFor="name" label="Full name" />
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
                placeholder="Jane Cooper"
                className={inputClasses()}
                required
                minLength={2}
              />
            </div>

            <FieldLabel htmlFor="email" label="Email" />
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                placeholder="you@example.com"
                className={inputClasses(
                  emailState.state === "valid" && "pr-10 ring-1 ring-emerald-500/40",
                  emailState.state === "invalid" && "pr-10 ring-1 ring-red-500/40",
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
            {emailState.state === "invalid" && (
              <p className="-mt-2 text-xs text-red-600 dark:text-red-400">
                {emailState.reason}
              </p>
            )}

            <FieldLabel htmlFor="password" label="Password" />
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                placeholder="At least 8 characters"
                className={inputClasses("pr-10")}
                required
                minLength={8}
                maxLength={128}
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
            {passwordIssues.length > 0 && (
              <ul className="-mt-2 space-y-1 text-xs text-red-600 dark:text-red-400">
                {passwordIssues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            )}

            {error && <FormAlert message={error} />}

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create account
            </button>
          </form>

          <Divider />
          <GoogleButton onClick={handleGoogle} disabled={submitting} label="Sign up with Google" />
        </div>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold text-zinc-900 underline-offset-4 hover:underline dark:text-white"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

function FieldLabel({ htmlFor, label }: { htmlFor: string; label: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
    >
      {label}
    </label>
  );
}

function inputClasses(...extra: (string | false | undefined)[]) {
  return cn(
    "h-11 w-full rounded-lg border border-zinc-200 bg-white px-10 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-white dark:focus:ring-white/10",
    ...extra,
  );
}

function FormAlert({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
      <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      <span>or</span>
      <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

function GoogleButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-full border border-zinc-200 bg-white text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
    >
      <GoogleIcon />
      {label}
    </button>
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
