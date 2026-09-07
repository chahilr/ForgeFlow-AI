import { AppError, ERROR_CODES } from "@/lib/errors";

export type WorkflowId = string;

export const WORKFLOW_STATUSES = ["draft", "active", "archived"] as const;

export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];

export type Workflow = {
  readonly id: WorkflowId;
  readonly organizationId: string;
  readonly name: string;
  readonly description: string | null;
  readonly status: WorkflowStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export class WorkflowNotFoundError extends AppError {
  constructor(message = "Workflow was not found.") {
    super({
      code: ERROR_CODES.NOT_FOUND,
      message,
      status: 404,
    });
    this.name = "WorkflowNotFoundError";
  }
}
