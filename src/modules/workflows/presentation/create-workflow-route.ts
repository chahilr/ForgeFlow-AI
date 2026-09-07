import { jsonData, jsonError, parseJsonBody } from "@/lib/api/http";
import { createWorkflow, CreateWorkflowSchema } from "@/modules/workflows";

export async function POST(request: Request): Promise<Response> {
  try {
    const input = await parseJsonBody(request, CreateWorkflowSchema);
    const workflow = await createWorkflow(input);
    return jsonData(workflow, 201);
  } catch (error) {
    return jsonError(error);
  }
}
