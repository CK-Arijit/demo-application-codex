"use client";

import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { InfoTile } from "@/components/ui/info-tile";
import { EyebrowText, LabelText, MutedText } from "@/components/ui/typography";
import ThemeToggle from "../../../components/theme/theme-toggle";

type SignInStage = "email" | "code";

type ErrorWithMessages = {
  errors?: Array<{
    longMessage?: string;
    message?: string;
  }>;
};

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray((error as ErrorWithMessages).errors) &&
    (error as ErrorWithMessages).errors?.length
  ) {
    const firstError = (error as ErrorWithMessages).errors?.[0];
    return (
      firstError?.longMessage ?? firstError?.message ?? "Unable to continue. Please try again."
    );
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unable to continue. Please try again.";
}

export default function SignInPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signIn } = useSignIn();

  const [stage, setStage] = useState<SignInStage>("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, router]);

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!signIn) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setFeedbackMessage("");

    try {
      const { error } = await signIn.create({ identifier: email.trim() });
      if (error) {
        throw error;
      }

      const { error: sendCodeError } = await signIn.emailCode.sendCode();
      if (sendCodeError) {
        throw sendCodeError;
      }

      setStage("code");
      setVerificationCode("");
      setFeedbackMessage(`Verification code sent to ${email.trim()}.`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCodeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!signIn) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setFeedbackMessage("");

    try {
      const { error } = await signIn.emailCode.verifyCode({
        code: verificationCode.trim(),
      });
      if (error) {
        throw error;
      }

      if (signIn.status !== "complete") {
        throw new Error("Verification is incomplete. Please try again.");
      }

      const { error: finalizeError } = await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const destination = decorateUrl("/dashboard");
          if (destination.startsWith("http")) {
            window.location.href = destination;
            return;
          }
          router.push(destination);
        },
      });
      if (finalizeError) {
        throw finalizeError;
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendCode() {
    if (!signIn) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setFeedbackMessage("");

    try {
      const { error } = await signIn.emailCode.sendCode();
      if (error) {
        throw error;
      }
      setFeedbackMessage(`A new verification code was sent to ${email.trim()}.`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChangeEmail() {
    setStage("email");
    setVerificationCode("");
    setErrorMessage("");
    setFeedbackMessage("");
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
            Sign in to access your dashboard and update your account profile details using Clerk
            authentication.
          </MutedText>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <InfoTile label="Auth Provider" value="Clerk" />
            <InfoTile label="Source of Truth" value="Salesforce" />
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-(--color-primary)">Sign In</h2>
          <MutedText className="mt-2">
            {stage === "email"
              ? "Enter your email to receive a one-time verification code."
              : "Enter the verification code sent to your email."}
          </MutedText>

          {stage === "email" ? (
            <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
              <label className="block space-y-1.5">
                <LabelText>Email</LabelText>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              <Button type="submit" disabled={isSubmitting || !email.trim()} fullWidth>
                {isSubmitting ? "Sending Code..." : "Continue"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="mt-6 space-y-4">
              <label className="block space-y-1.5">
                <LabelText>Verification Code</LabelText>
                <Input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                  required
                />
              </label>

              <Button type="submit" disabled={isSubmitting || !verificationCode.trim()} fullWidth>
                {isSubmitting ? "Verifying..." : "Verify and Sign In"}
              </Button>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                >
                  Resend code
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleChangeEmail}
                  disabled={isSubmitting}
                >
                  Change email
                </Button>
              </div>
            </form>
          )}

          {feedbackMessage ? (
            <MutedText className="mt-4 text-center text-xs">{feedbackMessage}</MutedText>
          ) : null}
          {errorMessage ? (
            <p className="mt-2 text-center text-xs font-medium text-red-500">{errorMessage}</p>
          ) : null}
        </Card>
      </div>
    </main>
  );
}
