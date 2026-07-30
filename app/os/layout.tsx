import type { Metadata } from "next";

import { AppShell } from "@/components/app-shell/app-shell";
import { adminNav, salesNav } from "@/components/app-shell/nav-config";
import { hasRole, requireAnyRole, requireRole } from "@/lib/auth-session";
import { featureFlags } from "@/lib/feature-flags";

export const metadata: Metadata = {
  title: {
    default: "theForge OS",
    template: "%s · theForge OS",
  },
};

export default async function OsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = featureFlags.forgeOsAdminOnly
    ? await requireRole("admin")
    : await requireAnyRole(["admin", "sales"]);
  const initials = session.user.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const isAdmin = hasRole(session.user.role, "admin");

  return (
    <AppShell
      roleLabel="theForge OS"
      navLabel={isAdmin ? "Studio" : "Operating system"}
      navItems={isAdmin ? adminNav : salesNav}
      userName={session.user.name}
      userSubtitle={isAdmin ? "Administrator" : "Sales workspace"}
      userInitials={initials}
      theme={session.user.theme === "light" ? "light" : "dark"}
    >
      {children}
    </AppShell>
  );
}
