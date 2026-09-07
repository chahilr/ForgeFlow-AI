import { NextResponse } from "next/server";
import { z } from "zod";

import { isAppError, validationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import type { ApiErrorBody, ApiSuccess } from "@/types/api";

export function jsonData<T>(
  data: T,
  status = 200,
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ data }, { status });
}

export function jsonError(error: unknown): NextResponse<ApiErrorBody> {
  if (isAppError(error)) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.status },
    );
  }

  logger.error("Unhandled error in API route", {
    name: error instanceof Error ? error.name : "UnknownError",
    message: error instanceof Error ? error.message : "Unknown error",
  });

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred.",
      },
    },
    { status: 500 },
  );
}

export async function parseJsonBody<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<z.infer<T>> {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    throw validationError("Request body must be valid JSON.");
  }

  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    throw validationError(firstIssue?.message ?? "Invalid request body.");
  }

  return parsed.data;
}
