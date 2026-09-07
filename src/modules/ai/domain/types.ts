export const AI_PROVIDERS = ["openai", "anthropic"] as const;

export type AiProvider = (typeof AI_PROVIDERS)[number];

export type AiJob = {
  readonly id: string;
  readonly organizationId: string;
  readonly provider: AiProvider;
  readonly prompt: string;
};
