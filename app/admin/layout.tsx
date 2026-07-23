import type { Metadata } from "next";

import { AppShell } from "@/components/app-shell/app-shell";
import { adminNav } from "@/components/app-shell/nav-config";
import { requireRole } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s · Admin · theForge",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("admin");
  const initials = session.user.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppShell
      roleLabel="Admin"
      navLabel="Studio"
      navItems={adminNav}
      userName={session.user.name}
      userSubtitle="Administrator"
      userInitials={initials}
      theme={session.user.theme === "light" ? "light" : "dark"}
    >
      {children}
    </AppShell>
  );
}
