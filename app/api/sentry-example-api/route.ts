import * as Sentry from "@sentry/nextjs";

export async function GET() {
  const error = new Error("This is a test API error from /api/sentry-example-api");
  Sentry.captureException(error);
  throw error;
}
