import AccountSkeleton from "../../../components/dashboard/account-skeleton";

export default function DashboardLoading() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="h-40 animate-pulse rounded-3xl border border-(--color-border) bg-(--color-surface) p-6" />
        <AccountSkeleton />
      </div>
    </main>
  );
}
