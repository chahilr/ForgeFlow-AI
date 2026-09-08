import { auth } from "@clerk/nextjs/server";

import { ForbiddenError, type AuthContext, UnauthorizedError } from "../domain/types";
import { findMembership, findOrganizationByClerkId } from "@/modules/organizations/infrastructure/repository";

function toRole(role: string | null): AuthContext["role"] | undefined {
  const normalized = role?.replace("org:", "");
  return normalized === "owner" || normalized === "admin" || normalized === "member" ? normalized : undefined;
}

export async function requireAuthenticatedUser(): Promise<{ userId: string }> {
  const { userId } = await auth();
  if (!userId) throw new UnauthorizedError();
  return { userId };
}

export async function requireOrganizationContext(): Promise<AuthContext> {
  const { userId, orgId, orgRole } = await auth();
  const role = toRole(orgRole);
  if (!userId) throw new UnauthorizedError();
  if (!orgId || !role) throw new ForbiddenError("An active organization is required.");
  const organization = await findOrganizationByClerkId(orgId);
  if (!organization) throw new ForbiddenError("Organization setup is not complete.");
  const membership = await findMembership(organization.id, userId);
  if (!membership || membership.role !== role) throw new ForbiddenError("Organization membership could not be verified.");
  return { userId, organizationId: organization.id, clerkOrganizationId: orgId, role };
}
