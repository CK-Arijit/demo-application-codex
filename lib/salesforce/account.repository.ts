import { Connection } from "jsforce";
import type {
  SalesforceRawPayload,
  SalesforceTokenSession,
} from "@/features/account/account.types";
import { SalesforceServiceError } from "./errors";

type JsforceRequestError = Error & {
  statusCode?: number;
  errorCode?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isJsforceRequestError(error: unknown): error is JsforceRequestError {
  return error instanceof Error;
}

export async function fetchSalesforceAccountByEmail(params: {
  session: SalesforceTokenSession;
  email: string;
}): Promise<SalesforceRawPayload> {
  const { session, email } = params;

  const conn = new Connection({
    instanceUrl: session.instanceUrl,
    accessToken: session.accessToken,
  });

  const endpointPath = `/services/apexrest/contactByEmail?email=${encodeURIComponent(email)}`;

  try {
    const response = await conn.request<SalesforceRawPayload>({
      method: "GET",
      url: endpointPath,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const isArrayPayload = Array.isArray(response) && response.length === 0;
    const isObjectPayload = isRecord(response) && Object.keys(response).length === 0;

    if (!response || isArrayPayload || isObjectPayload) {
      throw new SalesforceServiceError(
        "EMPTY_RESPONSE",
        "Salesforce returned an empty payload for account details."
      );
    }

    return response;
  } catch (error: unknown) {
    if (error instanceof SalesforceServiceError) {
      throw error;
    }

    if (isJsforceRequestError(error)) {
      if (error.statusCode === 401 || error.errorCode === "INVALID_SESSION_ID") {
        throw new SalesforceServiceError(
          "INVALID_OR_EXPIRED_TOKEN",
          "Salesforce access token is invalid or expired.",
          { cause: error }
        );
      }

      throw new SalesforceServiceError("SALESFORCE_API_FAILURE", "Salesforce API request failed.", {
        cause: error,
      });
    }

    throw new SalesforceServiceError("SALESFORCE_API_FAILURE", "Salesforce API request failed.");
  }
}
