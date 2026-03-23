import Link from "next/link";
import ThemeToggle from "../theme/theme-toggle";

export default function AccountHeader() {
  return (
    <header className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-secondary)]">
            Salesforce Account Portal
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--color-primary)]">Dashboard</h1>
          <p className="mt-2 max-w-lg text-sm text-[var(--color-muted)]">
            Review and edit your account details. Changes are simulated in UI mode right now and
            will be connected to Salesforce APIs next.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-secondary)] hover:text-[var(--color-primary)]"
          >
            Logout
          </Link>
        </div>
      </div>
    </header>
  );
}
