import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell/app-shell";
import { salesNav } from "@/components/app-shell/nav-config";
import { requireAnyRole } from "@/lib/auth-session";

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
  return (
    <AppShell
      roleLabel="Sales"
      navLabel="Enablement"
      navItems={salesNav}
      userName={session.user.name}
      userSubtitle="Sales workspace"
      userInitials={initials}
      theme={session.user.theme === "light" ? "light" : "dark"}
    >
      {children}
    </AppShell>
  );
}
