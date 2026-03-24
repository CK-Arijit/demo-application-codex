import * as Sentry from "@sentry/nextjs";
import { sentryBaseConfig } from "@/lib/sentry/config";

Sentry.init({
  ...sentryBaseConfig,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.replayIntegration()],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
