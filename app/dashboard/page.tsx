import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ArrowUpRight, Sparkles, ShieldCheck, Mail, Clock } from "lucide-react";

import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const requestHeaders = await headers();
  const session = await auth.api
    .getSession({ headers: requestHeaders })
    .catch(() => null);

  // proxy.ts handles this for unauthenticated users, but render-time also
  // safeguards direct rendering paths (e.g. preview builds, RSC fetches).
  if (!session?.user) {
    redirect("/auth/signin?redirect=/dashboard");
  }

  const { name, email, emailVerified } = session.user;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <div className="mb-10 flex flex-col gap-2">
        <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
          <Sparkles className="h-3.5 w-3.5" />
          Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Welcome back, {name?.split(" ")[0] ?? "friend"}.
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Here&apos;s a quick snapshot of your account.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card
          icon={<Mail className="h-5 w-5" />}
          title="Email"
          value={email}
          hint={emailVerified ? "Verified" : "Not verified"}
          hintTone={emailVerified ? "success" : "warning"}
        />
        <Card
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Account status"
          value="Active"
          hint="Better Auth session"
        />
        <Card
          icon={<Clock className="h-5 w-5" />}
          title="Member since"
          value={
            session.user.createdAt
              ? new Date(session.user.createdAt).toLocaleDateString()
              : "—"
          }
        />
        <Card
          icon={<ArrowUpRight className="h-5 w-5" />}
          title="Next steps"
          value="Customize your app"
          hint="Edit app/dashboard/page.tsx"
        />
      </div>

      <div className="mt-12 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/60 p-8 text-center dark:border-zinc-700 dark:bg-zinc-950/60">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          This is a placeholder dashboard. Replace it with your own UI.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-white"
        >
          Back to home
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </main>
  );
}

function Card({
  icon,
  title,
  value,
  hint,
  hintTone,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  hint?: string;
  hintTone?: "success" | "warning";
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
          {icon}
        </div>
        {hint && (
          <span
            className={
              hintTone === "warning"
                ? "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                : hintTone === "success"
                  ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            }
          >
            {hint}
          </span>
        )}
      </div>
      <p className="mt-5 text-xs font-medium uppercase tracking-wider text-zinc-500">
        {title}
      </p>
      <p className="mt-1 truncate text-lg font-semibold text-zinc-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
