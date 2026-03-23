"use client";

import Link from "next/link";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EyebrowText, MutedText, PrimaryTitle } from "@/components/ui/typography";

type DashboardErrorProps = Readonly<{
  reset: () => void;
}>;

export default function DashboardError({ reset }: DashboardErrorProps) {
  return (
    <main className="grid min-h-screen place-content-center px-6">
      <Card as="div" className="w-full max-w-md p-8 text-center">
        <EyebrowText>Dashboard Error</EyebrowText>
        <PrimaryTitle className="mt-3">Unable to load the dashboard</PrimaryTitle>
        <MutedText className="mt-3">
          Please try again. If the issue persists, return to sign in.
        </MutedText>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button type="button" onClick={reset} size="sm">
            Retry
          </Button>
          <Link href="/sign-in" className={buttonClasses({ variant: "outline", size: "sm" })}>
            Sign In
          </Link>
        </div>
      </Card>
    </main>
  );
}
