import { LayoutDashboard } from "lucide-react";
import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell/app-shell";
import { salesNav } from "@/components/app-shell/nav-config";
import { hasRole, requireAnyRole } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: { default: "Sales", template: "%s · Sales · The Forge" },
};
export default async function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAnyRole(["admin", "sales"]);
  const initials = session.user.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const navItems = hasRole(session.user.role, "admin")
    ? [
        {
          title: "Main dashboard",
          href: "/admin",
          icon: <LayoutDashboard />,
        },
        ...salesNav,
      ]
    : salesNav;
  return (
    <AppShell
      roleLabel="Sales"
      navLabel="Enablement"
      navItems={navItems}
      userName={session.user.name}
      userSubtitle="Sales workspace"
      userInitials={initials}
      theme={session.user.theme === "light" ? "light" : "dark"}
    >
      {children}
    </AppShell>
  );
}
