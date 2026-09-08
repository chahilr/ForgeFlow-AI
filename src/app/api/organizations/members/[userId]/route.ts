import { clerkClient } from "@clerk/nextjs/server";

import { jsonData, jsonError, parseJsonBody } from "@/lib/api/http";
import { canManageMembership, ForbiddenError, requireOrganizationContext } from "@/modules/auth";
import { UpdateOrganizationMemberSchema } from "@/modules/organizations";
import { findMembership, findOrganizationByClerkId } from "@/modules/organizations/infrastructure/repository";

type Params = { params: Promise<{ userId: string }> };

export async function PATCH(request: Request, { params }: Params): Promise<Response> {
  try {
    const context = await requireOrganizationContext();
    const { userId } = await params;
    const input = await parseJsonBody(request, UpdateOrganizationMemberSchema);
    const target = await findMembership(context.organizationId, userId);
    if (!target || !canManageMembership(context.role, target.role as typeof context.role)) {
      throw new ForbiddenError("Membership cannot be managed.");
    }
    const organization = await findOrganizationByClerkId(context.clerkOrganizationId);
    if (!organization) throw new ForbiddenError("Active organization was not found.");
    const client = await clerkClient();
    await client.organizations.updateOrganizationMembership({ organizationId: organization.clerkOrganizationId, userId, role: `org:${input.role}` });
    return jsonData({ userId, role: input.role });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params): Promise<Response> {
  try {
    const context = await requireOrganizationContext();
    const { userId } = await params;
    const target = await findMembership(context.organizationId, userId);
    if (!target || !canManageMembership(context.role, target.role as typeof context.role)) {
      throw new ForbiddenError("Membership cannot be managed.");
    }
    const organization = await findOrganizationByClerkId(context.clerkOrganizationId);
    if (!organization) throw new ForbiddenError("Active organization was not found.");
    const client = await clerkClient();
    await client.organizations.deleteOrganizationMembership({ organizationId: organization.clerkOrganizationId, userId });
    return new Response(null, { status: 204 });
  } catch (error) {
    return jsonError(error);
  }
}
