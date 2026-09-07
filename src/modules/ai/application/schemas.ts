import { z } from "zod";

import { AI_PROVIDERS } from "../domain/types";

export const CreateAiJobSchema = z.object({
  provider: z.enum(AI_PROVIDERS),
  prompt: z.string().min(1).max(8000),
});

export type CreateAiJobInput = z.infer<typeof CreateAiJobSchema>;
