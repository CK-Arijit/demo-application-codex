import { ZodError } from "zod";
import { accountEmailSchema, dashboardAccountDetailsSchema } from "./account.schema";
import { mapSalesforcePayloadToDashboardAccount } from "./account.mapper";
import type { DashboardAccountDetails } from "./account.types";
import { fetchSalesforceAccountByEmail } from "@/lib/salesforce/account.repository";
import { generateSalesforceToken } from "@/lib/salesforce/connection";
import { SalesforceServiceError } from "@/lib/salesforce/errors";
import { ApiRouteError } from "@/lib/api/errors";

export async function getDashboardAccountDetailsByEmail(
  email: string
): Promise<DashboardAccountDetails> {
  let normalizedEmail = "";

  try {
    normalizedEmail = accountEmailSchema.parse(email);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      throw new ApiRouteError(400, "INVALID_EMAIL", "A valid email is required.", { cause: error });
    }

    throw error;
  }

  try {
    const session = await generateSalesforceToken();
    const payload = await fetchSalesforceAccountByEmail({
      session,
      email: normalizedEmail,
    });

    const mapped = mapSalesforcePayloadToDashboardAccount({
      payload,
      fallbackEmail: normalizedEmail,
    });

    if (!mapped) {
      throw new ApiRouteError(
        404,
        "EMPTY_RESPONSE",
        "No account details were found for this user email."
      );
    }

    return dashboardAccountDetailsSchema.parse(mapped);
  } catch (error: unknown) {
    if (error instanceof ApiRouteError) {
      throw error;
    }

    if (error instanceof SalesforceServiceError) {
      if (error.code === "TOKEN_GENERATION_FAILED") {
        throw new ApiRouteError(502, error.code, "Unable to generate Salesforce access token.", {
          cause: error,
        });
      }

      if (error.code === "INVALID_OR_EXPIRED_TOKEN") {
        throw new ApiRouteError(502, error.code, "Salesforce access token is invalid or expired.", {
          cause: error,
        });
      }

      if (error.code === "EMPTY_RESPONSE") {
        throw new ApiRouteError(404, error.code, "No account details were returned.", {
          cause: error,
        });
      }

      throw new ApiRouteError(502, error.code, "Salesforce API request failed.", { cause: error });
    }

    throw new ApiRouteError(500, "INTERNAL_SERVER_ERROR", "Unable to fetch account details.", {
      cause: error,
    });
  }
}
