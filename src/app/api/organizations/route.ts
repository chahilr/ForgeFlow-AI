import { clerkClient } from "@clerk/nextjs/server";

import { jsonData, jsonError, parseJsonBody } from "@/lib/api/http";
import { requireAuthenticatedUser, requireOrganizationContext } from "@/modules/auth";
import { CreateOrganizationSchema } from "@/modules/organizations";
import { listMemberships } from "@/modules/organizations/infrastructure/repository";

export async function GET(): Promise<Response> {
  try {
    const context = await requireOrganizationContext();
    return jsonData(await listMemberships(context.organizationId));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const input = await parseJsonBody(request, CreateOrganizationSchema);
    const { userId } = await requireAuthenticatedUser();
    const client = await clerkClient();
    const organization = await client.organizations.createOrganization({
      name: input.name,
      slug: input.slug,
      createdBy: userId,
    });
    return jsonData({ id: organization.id, slug: organization.slug }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
