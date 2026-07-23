"use client";

import { usePathname } from "next/navigation";

import type { NavItem } from "@/components/app-shell/nav-config";

export function HeaderTitle({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const match =
    items.find((item) => item.href === pathname) ??
    [...items].reverse().find((item) => pathname.startsWith(item.href));

  return (
    <h1 className="text-sm font-semibold">{match?.title ?? "Overview"}</h1>
  );
}
