import { AppError, ERROR_CODES } from "@/lib/errors";

export type ExecutionId = string;

export const EXECUTION_STATUSES = [
  "queued",
  "running",
  "succeeded",
  "failed",
  "canceled",
] as const;

export type ExecutionStatus = (typeof EXECUTION_STATUSES)[number];

export type WorkflowExecution = {
  readonly id: ExecutionId;
  readonly workflowId: string;
  readonly organizationId: string;
  readonly status: ExecutionStatus;
  readonly startedAt: Date | null;
  readonly finishedAt: Date | null;
};

export class ExecutionNotFoundError extends AppError {
  constructor(message = "Workflow execution was not found.") {
    super({
      code: ERROR_CODES.NOT_FOUND,
      message,
      status: 404,
    });
    this.name = "ExecutionNotFoundError";
  }
}
