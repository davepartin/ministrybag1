"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Activity,
  Apple,
  BarChart3,
  ClipboardCheck,
  Dumbbell,
  Home,
  Library,
  LogOut,
  Settings,
  ShieldCheck,
  Sparkles,
  User
} from "lucide-react";
import { SignInPanel } from "@/components/auth/SignInPanel";
import { useAuth } from "@/components/auth/AuthProvider";
import { clsx } from "clsx";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/check-in", label: "Check-In", icon: ClipboardCheck },
  { href: "/workout", label: "Workout", icon: Dumbbell },
  { href: "/food", label: "Food", icon: Apple },
  { href: "/strength-tests", label: "Tests", icon: Activity },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/exercises", label: "Library", icon: Library },
  { href: "/settings", label: "Profile", icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, loading, supabaseReady, signOut } = useAuth();
  const needsAuth = supabaseReady && !user && !loading;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/20 bg-charcoal/95 text-white backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="rounded-xl bg-moss p-2">
                <ShieldCheck className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">Dave Strong</p>
                <p className="text-lg font-bold leading-tight">Durable strength</p>
              </div>
            </Link>
            <div className="flex items-center gap-2 text-sm">
              {!supabaseReady ? (
                <span className="hidden rounded-lg border border-amber-300/40 bg-amber-200/10 px-3 py-2 text-amber-100 sm:inline-flex">
                  Demo mode
                </span>
              ) : user ? (
                <>
                  <span className="hidden items-center gap-2 rounded-lg bg-white/10 px-3 py-2 sm:inline-flex">
                    <User className="h-4 w-4" aria-hidden />
                    {user.email}
                  </span>
                  <button className="rounded-lg bg-white/10 p-2 hover:bg-white/15" onClick={() => void signOut()} aria-label="Sign out">
                    <LogOut className="h-5 w-5" aria-hidden />
                  </button>
                </>
              ) : null}
            </div>
          </div>
          <nav className="-mx-1 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition",
                    active ? "bg-white text-charcoal" : "text-stone-200 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/future"
              className={clsx(
                "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition",
                pathname === "/future" ? "bg-white text-charcoal" : "text-stone-200 hover:bg-white/10 hover:text-white"
              )}
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Future
            </Link>
          </nav>
        </div>
      </header>

      {!supabaseReady ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <div className="mx-auto max-w-7xl">
            Add Supabase keys in <code className="font-semibold">.env.local</code> to enable authenticated cloud storage. Until then, entries save in this browser.
          </div>
        </div>
      ) : null}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="surface p-6 text-sm text-stone-600">Loading Dave Strong...</div>
        ) : needsAuth ? (
          <SignInPanel />
        ) : (
          children
        )}
      </main>
    </div>
  );
}
