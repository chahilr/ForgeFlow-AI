import type { ReactElement } from "react";

import { APP_CONFIG } from "@/config/app";
import { SiteHeader } from "@/components/shared/site-header";

export default function MarketingPage(): ReactElement {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          MVP foundation
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950">
          {APP_CONFIG.name}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600">
          {APP_CONFIG.description} This scaffold is a modular monolith with
          Postgres, Redis, and background job infrastructure ready for the first
          product slice.
        </p>
      </main>
    </div>
  );
}
