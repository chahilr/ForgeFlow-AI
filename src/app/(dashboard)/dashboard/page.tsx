import type { ReactElement } from "react";
import { auth } from "@clerk/nextjs/server";
import { CreateOrganization, OrganizationSwitcher } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/shared/site-header";

export default async function DashboardPage(): Promise<ReactElement> {
  const { userId, orgId } = await auth();
  if (!userId) redirect("/sign-in");

  if (!orgId) {
    return (
      <div className="flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16">
          <h1 className="text-2xl font-semibold tracking-tight">Create your organization</h1>
          <p className="mt-3 max-w-xl text-center text-zinc-600">An organization is required before you can use FlowForge.</p>
          <div className="mt-8"><CreateOrganization afterCreateOrganizationUrl="/dashboard" /></div>
        </main>
      </div>
    );
  }
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1><OrganizationSwitcher /></div>
        <p className="mt-3 max-w-xl text-zinc-600">
          Your authenticated, organization-scoped FlowForge workspace is ready.
        </p>
      </main>
    </div>
  );
}
