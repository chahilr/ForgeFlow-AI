import type { ReactElement } from "react";

import { SiteHeader } from "@/components/shared/site-header";

export default function DashboardPage(): ReactElement {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-3 max-w-xl text-zinc-600">
          Authentication and tenant-scoped workflows are not implemented yet.
          This route exists to reserve the authenticated application surface.
        </p>
      </main>
    </div>
  );
}
