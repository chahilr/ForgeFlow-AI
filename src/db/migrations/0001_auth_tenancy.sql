CREATE TABLE "users" (
  "id" text PRIMARY KEY NOT NULL,
  "email" text NOT NULL,
  "name" text NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "organizations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "clerk_organization_id" text NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "organizations_clerk_org_unique" ON "organizations" USING btree ("clerk_organization_id");
CREATE UNIQUE INDEX "organizations_slug_unique" ON "organizations" USING btree ("slug");

CREATE TABLE "organization_memberships" (
  "organization_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "role" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "organization_memberships_organization_id_user_id_pk" PRIMARY KEY("organization_id", "user_id"),
  CONSTRAINT "organization_memberships_role_check" CHECK ("role" IN ('owner', 'admin', 'member'))
);
CREATE INDEX "memberships_user_organization_idx" ON "organization_memberships" USING btree ("user_id", "organization_id");

CREATE TABLE "webhook_events" (
  "id" text PRIMARY KEY NOT NULL,
  "type" text NOT NULL,
  "received_at" timestamp with time zone DEFAULT now() NOT NULL
);
