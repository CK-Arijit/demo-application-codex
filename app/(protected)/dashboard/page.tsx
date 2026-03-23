import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AccountForm from "../../../components/dashboard/account-form";
import AccountHeader from "../../../components/dashboard/account-header";
import { PageShell } from "@/components/ui/page-shell";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <PageShell>
      <AccountHeader />
      <AccountForm />
    </PageShell>
  );
}
