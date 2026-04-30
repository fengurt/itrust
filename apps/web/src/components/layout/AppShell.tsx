import Link from "next/link";
import type { ReactNode } from "react";
import { AppNav } from "@/components/layout/AppNav";

export type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--color-surface)] text-[color:var(--color-ink)]">
      <a
        href="#main-content"
        className="pointer-events-none fixed left-4 top-4 z-50 -translate-y-16 rounded-[var(--radius-md)] border border-[color:var(--color-ink)]/15 bg-[color:var(--color-surface)] px-4 py-2 text-sm font-medium text-[color:var(--color-ink)] opacity-0 shadow-sm transition-all focus:pointer-events-auto focus:translate-y-0 focus:opacity-100 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--color-accent)]"
      >
        跳到主要内容
      </a>
      <header className="sticky top-0 z-40 border-b border-[color:var(--color-ink)]/10 bg-[color:var(--color-surface)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-[color:var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)]"
          >
            iTRUST Evaluation Model
          </Link>
          <AppNav />
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 outline-none"
      >
        {children}
      </main>
      <footer className="border-t border-[color:var(--color-ink)]/10 py-8 text-center text-xs text-[color:var(--color-ink)]/50">
        iTRUST Evaluation Model · 证据优先、多源核验
      </footer>
    </div>
  );
}
