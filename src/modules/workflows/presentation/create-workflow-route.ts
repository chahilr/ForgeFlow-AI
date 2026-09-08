import { jsonData, jsonError, parseJsonBody } from "@/lib/api/http";
import { createWorkflow, CreateWorkflowSchema } from "@/modules/workflows";
import { requireOrganizationContext } from "@/modules/auth";

export async function POST(request: Request): Promise<Response> {
  try {
    const input = await parseJsonBody(request, CreateWorkflowSchema);
    const context = await requireOrganizationContext();
    const workflow = await createWorkflow(context, input);
    return jsonData(workflow, 201);
  } catch (error) {
    return jsonError(error);
  }
}
