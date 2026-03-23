"use client";

import Link from "next/link";

export default function DashboardError({ reset }) {
  return (
    <main className="grid min-h-screen place-content-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
          Dashboard Error
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-[var(--color-primary)]">
          Unable to load the dashboard
        </h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          Please try again. If the issue persists, return to sign in.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Retry
          </button>
          <Link
            href="/sign-in"
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-secondary)]"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
