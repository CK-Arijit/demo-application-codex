import AccountSkeleton from "../../../components/dashboard/account-skeleton";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page-shell";

export default function DashboardLoading() {
  return (
    <PageShell>
      <Card as="div" className="h-40 animate-pulse p-6" />
      <AccountSkeleton />
    </PageShell>
  );
}
