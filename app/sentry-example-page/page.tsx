"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export default function SentryExamplePage() {
  const [apiStatus, setApiStatus] = useState<string>("idle");

  const throwClientError = () => {
    const error = new Error("This is a test error from /sentry-example-page");
    Sentry.captureException(error);
    setTimeout(() => {
      throw error;
    }, 0);
  };

  const triggerApiError = async () => {
    setApiStatus("calling");
    try {
      const response = await fetch("/api/sentry-example-api", { method: "GET" });
      if (!response.ok) {
        throw new Error("Sentry example API returned a non-success status.");
      }
      setApiStatus("done");
    } catch {
      setApiStatus("failed");
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-3xl flex-col justify-center p-6">
      <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-6">
        <h1 className="text-2xl font-semibold text-(--color-text)">Sentry Example Page</h1>
        <p className="mt-2 text-sm text-(--color-text-muted)">
          Use these buttons to trigger test errors and verify Sentry ingestion.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={throwClientError}
            className="rounded-md border border-(--color-border) px-4 py-2 text-sm font-medium text-(--color-text) hover:bg-(--color-primary-soft)"
          >
            Throw Sample Error
          </button>
          <button
            type="button"
            onClick={triggerApiError}
            className="rounded-md border border-(--color-border) px-4 py-2 text-sm font-medium text-(--color-text) hover:bg-(--color-primary-soft)"
          >
            Trigger API Error
          </button>
        </div>
        <p className="mt-4 text-xs text-(--color-text-muted)">API status: {apiStatus}</p>
      </div>
    </main>
  );
}
