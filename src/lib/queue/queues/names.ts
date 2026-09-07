export const QUEUE_NAMES = {
  default: "default",
  workflowExecution: "workflow-execution",
  webhooks: "webhooks",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
