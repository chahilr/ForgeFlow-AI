import { clerkClient } from "@clerk/nextjs/server";

import { jsonData, jsonError, parseJsonBody } from "@/lib/api/http";
import { ForbiddenError, requireOrganizationPermission, requireOrganizationContext } from "@/modules/auth";
import { InviteOrganizationMemberSchema } from "@/modules/organizations";
import { findOrganizationByClerkId } from "@/modules/organizations/infrastructure/repository";

export async function POST(request: Request): Promise<Response> {
  try {
    const context = await requireOrganizationContext();
    requireOrganizationPermission(context, "membership:manage");
    const input = await parseJsonBody(request, InviteOrganizationMemberSchema);
    const organization = await findOrganizationByClerkId(context.clerkOrganizationId);
    if (!organization) throw new ForbiddenError("Active organization was not found.");
    const client = await clerkClient();
    const invitation = await client.organizations.createOrganizationInvitation({
      organizationId: organization.clerkOrganizationId,
      emailAddress: input.email,
      role: `org:${input.role}`,
      inviterUserId: context.userId,
      redirectUrl: "/dashboard",
    });
    return jsonData({ id: invitation.id, email: invitation.emailAddress, role: input.role }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
