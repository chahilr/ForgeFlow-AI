import { ForbiddenError, type AuthContext } from "../domain/types";

export type OrganizationPermission = "organization:manage" | "membership:manage";

export function canManageOrganization(role: AuthContext["role"]): boolean {
  return role === "owner";
}

export function canManageMembership(
  actor: AuthContext["role"],
  target: AuthContext["role"],
): boolean {
  if (actor === "owner") return target !== "owner";
  return actor === "admin" && target === "member";
}

export function requireOrganizationPermission(
  context: AuthContext,
  permission: OrganizationPermission,
): void {
  const allowed = permission === "organization:manage"
    ? canManageOrganization(context.role)
    : context.role === "owner" || context.role === "admin";
  if (!allowed) throw new ForbiddenError();
}
