import * as Sentry from "@sentry/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getDashboardAccountDetailsByEmail } from "@/features/account/account.service";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { ApiRouteError, normalizeApiRouteError } from "@/lib/api/errors";

export const runtime = "nodejs";

type AuthenticatedEmailResult =
  | {
      email: string;
    }
  | {
      error: ReturnType<typeof apiError>;
    };

async function getAuthenticatedEmail(request: Request): Promise<AuthenticatedEmailResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: apiError("Authentication required.", "UNAUTHORIZED", 401),
    };
  }

  const user = await currentUser();
  const primaryEmail = user?.primaryEmailAddress?.emailAddress?.trim() ?? "";
  const fallbackEmail = user?.emailAddresses?.[0]?.emailAddress?.trim() ?? "";
  const loggedInEmail = primaryEmail || fallbackEmail;
  const requestUrl = new URL(request.url);
  const requestEmail = requestUrl.searchParams.get("email")?.trim() ?? "";

  if (!loggedInEmail && !requestEmail) {
    return {
      error: apiError("Missing user email.", "MISSING_EMAIL", 400),
    };
  }

  if (requestEmail && loggedInEmail && requestEmail.toLowerCase() !== loggedInEmail.toLowerCase()) {
    return {
      error: apiError("Email does not match the authenticated user.", "EMAIL_MISMATCH", 403),
    };
  }

  return {
    email: requestEmail || loggedInEmail,
  };
}

export async function GET(request: Request) {
  const emailResult = await getAuthenticatedEmail(request);

  if ("error" in emailResult) {
    return emailResult.error;
  }

  try {
    const data = await getDashboardAccountDetailsByEmail(emailResult.email);
    return apiSuccess(data);
  } catch (error: unknown) {
    const normalizedError = normalizeApiRouteError(error);

    if (!(error instanceof ApiRouteError)) {
      Sentry.captureException(error);
    }

    return apiError(normalizedError.message, normalizedError.code, normalizedError.status);
  }
}
