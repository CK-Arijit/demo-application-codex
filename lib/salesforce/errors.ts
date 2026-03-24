export type SalesforceErrorCode =
  | "TOKEN_GENERATION_FAILED"
  | "INVALID_OR_EXPIRED_TOKEN"
  | "SALESFORCE_API_FAILURE"
  | "EMPTY_RESPONSE";

export class SalesforceServiceError extends Error {
  code: SalesforceErrorCode;

  constructor(code: SalesforceErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.code = code;
    this.name = "SalesforceServiceError";
  }
}
