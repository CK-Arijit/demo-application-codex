type SentryEnvironment = "development" | "test" | "production";

const currentEnvironment = (process.env.NODE_ENV ?? "development") as SentryEnvironment;

export const sentryBaseConfig = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
  environment: currentEnvironment,
  sendDefaultPii: false,
  tracesSampleRate: currentEnvironment === "development" ? 1.0 : 0.1,
} as const;

