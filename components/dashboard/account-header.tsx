import { Card } from "@/components/ui/card";
import { EyebrowText, MutedText, PrimaryTitle } from "@/components/ui/typography";
import ThemeToggle from "../theme/theme-toggle";

export default function AccountHeader() {
  return (
    <Card as="header" className="p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <EyebrowText className="text-sm font-medium normal-case tracking-normal">
            Salesforce Account Portal
          </EyebrowText>
          <PrimaryTitle className="mt-1">Dashboard</PrimaryTitle>
          <MutedText className="mt-2 max-w-lg">
            Review and edit your account details. Changes are simulated in UI mode right now and
            will be connected to Salesforce APIs next.
          </MutedText>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </Card>
  );
}
