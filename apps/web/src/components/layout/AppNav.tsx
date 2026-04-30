"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/model", label: "模型视图" },
  { href: "/research", label: "评估" },
  { href: "/uploads", label: "资料" },
  { href: "/templates", label: "商业模式模板" },
  { href: "/cases", label: "案例库" },
] as const;

function pathMatchesNavItem(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav
      className="flex flex-wrap justify-end gap-x-5 gap-y-2 text-sm"
      aria-label="主导航"
    >
      {navItems.map((item) => {
        const active = pathMatchesNavItem(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`border-b-2 pb-0.5 transition-colors ${
              active
                ? "border-[color:var(--color-accent)] text-[color:var(--color-ink)]"
                : "border-transparent text-[color:var(--color-ink)]/80 hover:border-[color:var(--color-ink)]/20 hover:text-[color:var(--color-ink)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
