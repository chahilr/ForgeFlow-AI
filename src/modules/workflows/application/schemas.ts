import { z } from "zod";

export const CreateWorkflowSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
});

export type CreateWorkflowInput = z.infer<typeof CreateWorkflowSchema>;
