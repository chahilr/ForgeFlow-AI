import { AppError, ERROR_CODES } from "@/lib/errors";

export type IntegrationId = string;

export const INTEGRATION_PROVIDERS = ["http", "webhook", "slack"] as const;

export type IntegrationProvider = (typeof INTEGRATION_PROVIDERS)[number];

export type Integration = {
  readonly id: IntegrationId;
  readonly organizationId: string;
  readonly provider: IntegrationProvider;
  readonly name: string;
};

export class IntegrationNotFoundError extends AppError {
  constructor(message = "Integration was not found.") {
    super({
      code: ERROR_CODES.NOT_FOUND,
      message,
      status: 404,
    });
    this.name = "IntegrationNotFoundError";
  }
}
