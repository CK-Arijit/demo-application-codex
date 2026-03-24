import { NextResponse } from "next/server";

type SuccessPayload<T> = {
  success: true;
  data: T;
};

type ErrorPayload = {
  success: false;
  error: string;
  code?: string;
};

const noStoreHeaders = {
  "Cache-Control": "no-store",
} as const;

export function apiSuccess<T>(data: T, status = 200): NextResponse<SuccessPayload<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    {
      status,
      headers: noStoreHeaders,
    }
  );
}

export function apiError(error: string, code?: string, status = 500): NextResponse<ErrorPayload> {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
    },
    {
      status,
      headers: noStoreHeaders,
    }
  );
}
