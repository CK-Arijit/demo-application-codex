export default function AccountSkeleton() {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm md:p-6">
      <div className="mb-5 h-6 w-40 animate-pulse rounded bg-[var(--color-surface-soft)]" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-12 animate-pulse rounded-xl bg-[var(--color-surface-soft)]" />
        <div className="h-12 animate-pulse rounded-xl bg-[var(--color-surface-soft)]" />
        <div className="h-12 animate-pulse rounded-xl bg-[var(--color-surface-soft)]" />
        <div className="h-12 animate-pulse rounded-xl bg-[var(--color-surface-soft)]" />
      </div>
      <div className="mt-4 h-24 animate-pulse rounded-xl bg-[var(--color-surface-soft)]" />
      <div className="mt-5 h-11 w-32 animate-pulse rounded-xl bg-[var(--color-surface-soft)]" />
    </div>
  );
}
