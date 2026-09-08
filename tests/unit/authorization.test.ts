import { describe, expect, it } from "vitest";

import { canManageMembership, canManageOrganization, requireOrganizationPermission } from "@/modules/auth";

const context = (role: "owner" | "admin" | "member") => ({
  userId: "user_1",
  organizationId: "00000000-0000-0000-0000-000000000001",
  clerkOrganizationId: "org_1",
  role,
});

describe("organization authorization", () => {
  it("limits organization settings to owners", () => {
    expect(canManageOrganization("owner")).toBe(true);
    expect(canManageOrganization("admin")).toBe(false);
    expect(() => requireOrganizationPermission(context("member"), "membership:manage")).toThrow("permission");
  });

  it("prevents admin escalation and owner manipulation", () => {
    expect(canManageMembership("owner", "admin")).toBe(true);
    expect(canManageMembership("owner", "owner")).toBe(false);
    expect(canManageMembership("admin", "member")).toBe(true);
    expect(canManageMembership("admin", "admin")).toBe(false);
    expect(canManageMembership("member", "member")).toBe(false);
  });
});
