import { Webhook } from "svix";
import { eq } from "drizzle-orm";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

import { getDb, organizations, webhookEvents } from "@/db";
import { getEnv } from "@/lib/env";
import { jsonError } from "@/lib/api/http";
import { removeMembership, upsertMembership, upsertOrganization, upsertUser } from "@/modules/organizations/infrastructure/repository";
import { NextRequest } from "next/server";

type ClerkEvent = { id: string; type: string; data: Record<string, unknown> };

function eventString(data: Record<string, unknown>, key: string): string | undefined {
  const value = data[key];
  return typeof value === "string" ? value : undefined;
}

function eventRecord(data: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = data[key];
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function role(value: string | undefined): "owner" | "admin" | "member" {
  const normalized = value?.replace("org:", "");
  return normalized === "owner" || normalized === "admin" ? normalized : "member";
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const event = await verifyWebhook(request);
    const [alreadyHandled] = await getDb().select().from(webhookEvents).where(eq(webhookEvents.id, event.data.id!));
    if (alreadyHandled) return new Response(null, { status: 204 });

    if (event.type === "user.created" || event.type === "user.updated") {
      const data = event.data;
      const emails = event.data.email_addresses as Array<{ email_address?: string }> | undefined;
      await upsertUser({ id: data.id, email: emails?.[0]?.email_address ?? "", name: [data.first_name, data.last_name].filter(Boolean).join(" ") || "Unknown user" });
    }
    if (event.type === "organization.created" || event.type === "organization.updated") {
      const data = event.data;
      await upsertOrganization({ clerkOrganizationId: data.id, name: data.name, slug: data.slug });
    }
    if (event.type === "organizationMembership.created" || event.type === "organizationMembership.updated") {
      const data = event.data;
      const organizationData = data.organization;
      const userData = data.public_user_data;
      const organization = await upsertOrganization({
        clerkOrganizationId: organizationData.id,
        name: organizationData.name,
        slug: organizationData.slug,
      });
      const userId = userData.user_id;
      await upsertUser({ id: userId, email: userData.identifier ?? "", name: [userData.first_name, userData.last_name].filter(Boolean).join(" ") || "Unknown user" });
      await upsertMembership({ organizationId: organization!.id, userId, role: role(data.role) });
    }
    if (event.type === "organizationMembership.deleted") {
      const data = event.data;
      const organizationData = data.organization;
      const userData = data.public_user_data;
      const organization = await getDb().select().from(organizations).where(eq(organizations.clerkOrganizationId, organizationData.id));
      if (organization[0]) await removeMembership(organization[0].id, userData.user_id);
    }
    await getDb().insert(webhookEvents).values({ id: event.data.id!, type: event.type }).onConflictDoNothing();
    return new Response(null, { status: 204 });
  } catch (error) {
    return jsonError(error);
  }
}
