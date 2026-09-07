import { describe, expect, it } from "vitest";

import { CreateWorkflowSchema } from "@/modules/workflows";

describe("CreateWorkflowSchema", () => {
  it("accepts a valid workflow name", () => {
    const result = CreateWorkflowSchema.parse({
      name: "Onboarding",
      description: "Welcome new users",
    });

    expect(result).toEqual({
      name: "Onboarding",
      description: "Welcome new users",
    });
  });

  it("rejects an empty name", () => {
    const result = CreateWorkflowSchema.safeParse({ name: "" });

    expect(result.success).toBe(false);
  });
});
