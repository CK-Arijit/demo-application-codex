import AccountForm from "../../../components/dashboard/account-form";
import AccountHeader from "../../../components/dashboard/account-header";

export default function DashboardPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <AccountHeader />
        <AccountForm />
      </div>
    </main>
  );
}
