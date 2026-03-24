import { Connection, OAuth2 } from "jsforce";
import type { SalesforceTokenSession } from "@/features/account/account.types";
import { getSalesforceEnvConfig } from "./config";
import { SalesforceServiceError } from "./errors";

type JsforceError = Error & {
  statusCode?: number;
  errorCode?: string;
};

function isJsforceError(error: unknown): error is JsforceError {
  return error instanceof Error;
}

export async function generateSalesforceToken(): Promise<SalesforceTokenSession> {
  const config = getSalesforceEnvConfig();

  const oauth2 = new OAuth2({
    loginUrl: config.SALESFORCE_LOGIN_URL,
    clientId: config.SALESFORCE_CLIENT_ID,
    clientSecret: config.SALESFORCE_CLIENT_SECRET,
  });

  const conn = new Connection({ oauth2 });

  try {
    await conn.login(
      config.SALESFORCE_USERNAME,
      `${config.SALESFORCE_PASSWORD}${config.SALESFORCE_SECURITY_TOKEN}`
    );

    if (!conn.accessToken || !conn.instanceUrl) {
      throw new SalesforceServiceError(
        "TOKEN_GENERATION_FAILED",
        "Salesforce did not return an access token."
      );
    }

    return {
      accessToken: conn.accessToken,
      instanceUrl: conn.instanceUrl,
    };
  } catch (error: unknown) {
    if (error instanceof SalesforceServiceError) {
      throw error;
    }

    if (isJsforceError(error)) {
      throw new SalesforceServiceError(
        "TOKEN_GENERATION_FAILED",
        "Unable to generate Salesforce access token.",
        { cause: error }
      );
    }

    throw new SalesforceServiceError(
      "TOKEN_GENERATION_FAILED",
      "Unable to generate Salesforce access token."
    );
  }
}
