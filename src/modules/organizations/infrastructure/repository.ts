import { and, eq } from "drizzle-orm";

import { getDb, organizationMemberships, organizations, users } from "@/db";
import type { OrganizationRole } from "../domain/types";

export async function findOrganizationByClerkId(clerkOrganizationId: string) {
  const [organization] = await getDb().select().from(organizations)
    .where(eq(organizations.clerkOrganizationId, clerkOrganizationId));
  return organization;
}

export async function findMembership(organizationId: string, userId: string) {
  const [membership] = await getDb().select().from(organizationMemberships)
    .where(and(eq(organizationMemberships.organizationId, organizationId), eq(organizationMemberships.userId, userId)));
  return membership;
}

export async function upsertUser(user: { id: string; email: string; name: string }): Promise<void> {
  await getDb().insert(users).values(user).onConflictDoUpdate({
    target: users.id,
    set: { email: user.email, name: user.name, updatedAt: new Date() },
  });
}

export async function upsertOrganization(organization: { clerkOrganizationId: string; name: string; slug: string }) {
  const [record] = await getDb().insert(organizations).values(organization).onConflictDoUpdate({
    target: organizations.clerkOrganizationId,
    set: { name: organization.name, slug: organization.slug, updatedAt: new Date() },
  }).returning();
  return record;
}

export async function upsertMembership(input: { organizationId: string; userId: string; role: OrganizationRole }): Promise<void> {
  await getDb().insert(organizationMemberships).values(input).onConflictDoUpdate({
    target: [organizationMemberships.organizationId, organizationMemberships.userId],
    set: { role: input.role, updatedAt: new Date() },
  });
}

export async function removeMembership(organizationId: string, userId: string): Promise<void> {
  await getDb().delete(organizationMemberships).where(and(
    eq(organizationMemberships.organizationId, organizationId),
    eq(organizationMemberships.userId, userId),
  ));
}

export async function listMemberships(organizationId: string) {
  return getDb().select({ userId: organizationMemberships.userId, role: organizationMemberships.role, email: users.email, name: users.name })
    .from(organizationMemberships).innerJoin(users, eq(users.id, organizationMemberships.userId))
    .where(eq(organizationMemberships.organizationId, organizationId));
}
