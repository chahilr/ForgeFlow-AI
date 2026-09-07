import { z } from "zod";

export const EnqueueExecutionSchema = z.object({
  workflowId: z.string().min(1),
});

export type EnqueueExecutionInput = z.infer<typeof EnqueueExecutionSchema>;
