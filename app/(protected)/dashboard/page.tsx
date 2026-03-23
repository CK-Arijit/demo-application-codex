import AccountForm from "../../../components/dashboard/account-form";
import AccountHeader from "../../../components/dashboard/account-header";
import { PageShell } from "@/components/ui/page-shell";

export default function DashboardPage() {
  return (
    <PageShell>
      <AccountHeader />
      <AccountForm />
    </PageShell>
  );
}
