import type { ReactElement } from "react";
import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

import { APP_CONFIG } from "@/config/app";

export function SiteHeader(): ReactElement {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          {APP_CONFIG.name}
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-600">
          <Link href="/dashboard" className="hover:text-zinc-950">
            Dashboard
          </Link>
          <Link href="/api/health" className="hover:text-zinc-950">
            Health
          </Link>
          <Show when='signed-out'>
            <SignInButton><button type="button">Sign in</button></SignInButton>
            <SignUpButton><button type="button" className="text-zinc-950">Create account</button></SignUpButton>
          </Show>
          <Show when='signed-in'><UserButton /></Show>
        </nav>
      </div>
    </header>
  );
}
