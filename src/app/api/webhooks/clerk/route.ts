import { Webhook } from "svix";
import { eq } from "drizzle-orm";

import { getDb, organizations, webhookEvents } from "@/db";
import { getEnv } from "@/lib/env";
import { jsonError } from "@/lib/api/http";
import { removeMembership, upsertMembership, upsertOrganization, upsertUser } from "@/modules/organizations/infrastructure/repository";

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

export async function POST(request: Request): Promise<Response> {
  try {
    const secret = getEnv().CLERK_WEBHOOK_SIGNING_SECRET;
    if (!secret) return new Response("Webhook signing secret is not configured.", { status: 503 });
    const payload = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    const event = new Webhook(secret).verify(payload, headers) as ClerkEvent;
    const [alreadyHandled] = await getDb().select().from(webhookEvents).where(eq(webhookEvents.id, event.id));
    if (alreadyHandled) return new Response(null, { status: 204 });

    const data = event.data;
    if (event.type === "user.created" || event.type === "user.updated") {
      const emails = data.email_addresses as Array<{ email_address?: string }> | undefined;
      await upsertUser({ id: eventString(data, "id")!, email: emails?.[0]?.email_address ?? "", name: [eventString(data, "first_name"), eventString(data, "last_name")].filter(Boolean).join(" ") || "Unknown user" });
    }
    if (event.type === "organization.created" || event.type === "organization.updated") {
      await upsertOrganization({ clerkOrganizationId: eventString(data, "id")!, name: eventString(data, "name")!, slug: eventString(data, "slug")! });
    }
    if (event.type === "organizationMembership.created" || event.type === "organizationMembership.updated") {
      const organizationData = eventRecord(data, "organization");
      const userData = eventRecord(data, "public_user_data");
      const organization = await upsertOrganization({
        clerkOrganizationId: eventString(organizationData, "id")!,
        name: eventString(organizationData, "name")!,
        slug: eventString(organizationData, "slug")!,
      });
      const userId = eventString(userData, "user_id")!;
      await upsertUser({ id: userId, email: eventString(userData, "identifier") ?? "", name: [eventString(userData, "first_name"), eventString(userData, "last_name")].filter(Boolean).join(" ") || "Unknown user" });
      await upsertMembership({ organizationId: organization!.id, userId, role: role(eventString(data, "role")) });
    }
    if (event.type === "organizationMembership.deleted") {
      const organizationData = eventRecord(data, "organization");
      const userData = eventRecord(data, "public_user_data");
      const organization = await getDb().select().from(organizations).where(eq(organizations.clerkOrganizationId, eventString(organizationData, "id")!));
      if (organization[0]) await removeMembership(organization[0].id, eventString(userData, "user_id")!);
    }
    await getDb().insert(webhookEvents).values({ id: event.id, type: event.type }).onConflictDoNothing();
    return new Response(null, { status: 204 });
  } catch (error) {
    return jsonError(error);
  }
}
