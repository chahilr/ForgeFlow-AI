import { AppError, ERROR_CODES } from "@/lib/errors";

export type UserId = string;

export type User = {
  readonly id: UserId;
  readonly email: string;
  readonly name: string;
};

export type AuthContext = {
  readonly userId: UserId;
  readonly organizationId: string;
};

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication is required.") {
    super({
      code: ERROR_CODES.UNAUTHORIZED,
      message,
      status: 401,
    });
    this.name = "UnauthorizedError";
  }
}
