import { notImplementedError } from "@/lib/errors";
import type { AuthContext } from "@/modules/auth";

import type { CreateWorkflowInput } from "./schemas";
import type { Workflow } from "../domain/types";

export async function createWorkflow(
  _context: AuthContext,
  _input: CreateWorkflowInput,
): Promise<Workflow> {
  throw notImplementedError("Creating workflows is not available yet.");
}
