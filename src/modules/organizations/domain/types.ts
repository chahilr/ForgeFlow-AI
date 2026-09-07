import { AppError, ERROR_CODES } from "@/lib/errors";

export type OrganizationId = string;

export const ORGANIZATION_ROLES = ["owner", "admin", "member"] as const;

export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];

export type Organization = {
  readonly id: OrganizationId;
  readonly name: string;
  readonly slug: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type OrganizationMembership = {
  readonly organizationId: OrganizationId;
  readonly userId: string;
  readonly role: OrganizationRole;
};

export class OrganizationNotFoundError extends AppError {
  constructor(message = "Organization was not found.") {
    super({
      code: ERROR_CODES.NOT_FOUND,
      message,
      status: 404,
    });
    this.name = "OrganizationNotFoundError";
  }
}
