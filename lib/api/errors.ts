import { ZodError } from "zod";

export class ApiRouteError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.status = status;
    this.code = code;
    this.name = "ApiRouteError";
  }
}

export function normalizeApiRouteError(error: unknown): ApiRouteError {
  if (error instanceof ApiRouteError) {
    return error;
  }

  if (error instanceof ZodError) {
    return new ApiRouteError(400, "VALIDATION_ERROR", "Invalid request payload.", { cause: error });
  }

  return new ApiRouteError(500, "INTERNAL_SERVER_ERROR", "Unexpected server error.", {
    cause: error,
  });
}
