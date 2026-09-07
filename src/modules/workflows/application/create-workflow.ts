import { notImplementedError } from "@/lib/errors";

import type { CreateWorkflowInput } from "./schemas";
import type { Workflow } from "../domain/types";

export async function createWorkflow(
  _input: CreateWorkflowInput,
): Promise<Workflow> {
  throw notImplementedError("Creating workflows is not available yet.");
}
