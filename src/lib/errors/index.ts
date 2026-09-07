export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type AppErrorOptions = {
  readonly code: ErrorCode;
  readonly message: string;
  readonly status: number;
  readonly cause?: unknown;
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;

  constructor(options: AppErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = "AppError";
    this.code = options.code;
    this.status = options.status;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function validationError(message: string): AppError {
  return new AppError({
    code: ERROR_CODES.VALIDATION_ERROR,
    message,
    status: 400,
  });
}

export function notImplementedError(message: string): AppError {
  return new AppError({
    code: ERROR_CODES.NOT_IMPLEMENTED,
    message,
    status: 501,
  });
}
