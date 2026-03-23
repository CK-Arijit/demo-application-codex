"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "../../../components/theme/theme-toggle";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("jane@example.com");
  const [password, setPassword] = useState("password123");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-[var(--color-secondary)]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[var(--color-primary)]/15 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-5xl items-start justify-end">
        <ThemeToggle />
      </div>

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-8 pt-6 md:grid-cols-[1.15fr,1fr]">
        <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
            Secure Portal
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-[var(--color-primary)]">
            Manage Your Salesforce Account
          </h1>
          <p className="mt-4 max-w-xl text-base text-[var(--color-muted)]">
            Sign in to access your dashboard and update your account profile details. This is a UI
            prototype screen with no authentication backend wired yet.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[var(--color-surface-soft)] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                Auth Provider
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--color-primary)]">
                Clerk (planned)
              </p>
            </div>
            <div className="rounded-2xl bg-[var(--color-surface-soft)] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                Source of Truth
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--color-primary)]">Salesforce</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Sign In</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Enter your account credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-[var(--color-text)]">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-ring)]"
                required
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-[var(--color-text)]">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-ring)]"
                required
              />
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-[var(--color-muted)]">
                <input type="checkbox" defaultChecked className="accent-[var(--color-secondary)]" />
                Remember me
              </label>
              <button
                type="button"
                className="font-medium text-[var(--color-secondary)] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
            UI demo mode only. Form currently routes to dashboard without backend auth.
          </p>
          <p className="mt-2 text-center text-sm text-[var(--color-muted)]">
            Need quick access?{" "}
            <Link
              href="/dashboard"
              className="font-semibold text-[var(--color-secondary)] hover:underline"
            >
              Open Dashboard
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
