"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

type GlobalErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-(--color-background) p-6">
        <div className="w-full max-w-lg rounded-xl border border-(--color-border) bg-(--color-surface) p-6 text-center">
          <h1 className="text-xl font-semibold text-(--color-text)">Something went wrong</h1>
          <p className="mt-2 text-sm text-(--color-text-muted)">
            The error has been reported. Try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 rounded-md border border-(--color-border) px-4 py-2 text-sm font-medium text-(--color-text) hover:bg-(--color-primary-soft)"
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}

