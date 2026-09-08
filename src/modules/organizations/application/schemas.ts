import { z } from "zod";

export const CreateOrganizationSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens."),
});

export type CreateOrganizationInput = z.infer<typeof CreateOrganizationSchema>;

export const InviteOrganizationMemberSchema = z.object({
  email: z.email(),
  role: z.enum(["admin", "member"]),
});

export const UpdateOrganizationMemberSchema = z.object({
  role: z.enum(["admin", "member"]),
});
