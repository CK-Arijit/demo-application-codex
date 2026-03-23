"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { InfoTile } from "@/components/ui/info-tile";
import { EyebrowText, LabelText, MutedText } from "@/components/ui/typography";
import ThemeToggle from "../../../components/theme/theme-toggle";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("jane@example.com");
  const [password, setPassword] = useState("password123");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-(--color-secondary)/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-(--color-primary)/15 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-5xl items-start justify-end">
        <ThemeToggle />
      </div>

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-8 pt-6 md:grid-cols-[1.15fr,1fr]">
        <Card className="p-8">
          <EyebrowText className="text-sm tracking-wider">Secure Portal</EyebrowText>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-(--color-primary)">
            Manage Your Salesforce Account
          </h1>
          <MutedText className="mt-4 max-w-xl text-base">
            Sign in to access your dashboard and update your account profile details. This is a UI
            prototype screen with no authentication backend wired yet.
          </MutedText>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <InfoTile label="Auth Provider" value="Clerk (planned)" />
            <InfoTile label="Source of Truth" value="Salesforce" />
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-(--color-primary)">Sign In</h2>
          <MutedText className="mt-2">Enter your account credentials to continue.</MutedText>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block space-y-1.5">
              <LabelText>Email</LabelText>
              <Input type="email" value={email} onChange={handleEmailChange} required />
            </label>
            <label className="block space-y-1.5">
              <LabelText>Password</LabelText>
              <Input type="password" value={password} onChange={handlePasswordChange} required />
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-(--color-muted)">
                <input type="checkbox" defaultChecked className="accent-(--color-secondary)" />
                Remember me
              </label>
              <button
                type="button"
                className="font-medium text-(--color-secondary) hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" disabled={isSubmitting} fullWidth>
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <MutedText className="mt-4 text-center text-xs">
            UI demo mode only. Form currently routes to dashboard without backend auth.
          </MutedText>
          <MutedText className="mt-2 text-center">
            Need quick access?{" "}
            <Link
              href="/dashboard"
              className="font-semibold text-(--color-secondary) hover:underline"
            >
              Open Dashboard
            </Link>
          </MutedText>
        </Card>
      </div>
    </main>
  );
}
