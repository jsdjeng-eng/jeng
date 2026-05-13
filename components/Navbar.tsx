"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogOut, Sparkles } from "lucide-react";

import { signOut, useSession } from "@/lib/auth-client";
import { cn, getInitials } from "@/lib/utils";

import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const user = session.data?.user;
  const verified = user?.emailVerified === true;

  // Safety net: if a logged-in but unverified user lands on a public page
  // (e.g. they manually navigated), proxy.ts should already redirect them,
  // but we mirror that on the client just in case.
  useEffect(() => {
    if (session.isPending) return;
    if (user && !verified && pathname && !pathname.startsWith("/auth/")) {
      router.replace("/auth/verify-email");
    }
  }, [session.isPending, user, verified, pathname, router]);

  // Close dropdown on outside click.
  useEffect(() => {
    if (!menuOpen) return;
    function onClick(event: MouseEvent) {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  async function handleSignOut() {
    setMenuOpen(false);
    await signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
            <Sparkles className="h-4 w-4" />
          </span>
          Jeng
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session.isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-full border border-zinc-200 bg-white pr-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800",
                )}
              >
                <span className="flex h-7 w-7 -ml-px items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">
                  {getInitials(user.name ?? user.email ?? "?")}
                </span>
                <span className="hidden max-w-[120px] truncate sm:inline">
                  {user.name ?? user.email}
                </span>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="border-b border-zinc-100 p-4 dark:border-zinc-900">
                    <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                      {user.name ?? "Signed in"}
                    </p>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {user.email}
                    </p>
                    {!verified && (
                      <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                        Email not verified
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/auth/signin"
                className="inline-flex h-9 items-center rounded-full px-3 text-sm font-medium text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex h-9 items-center rounded-full bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
