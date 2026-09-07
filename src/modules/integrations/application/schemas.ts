import { z } from "zod";

import { INTEGRATION_PROVIDERS } from "../domain/types";

export const CreateIntegrationSchema = z.object({
  name: z.string().min(1).max(120),
  provider: z.enum(INTEGRATION_PROVIDERS),
});

export type CreateIntegrationInput = z.infer<typeof CreateIntegrationSchema>;
