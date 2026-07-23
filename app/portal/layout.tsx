import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell/app-shell";
import { portalNav } from "@/components/app-shell/nav-config";
import { requireRole } from "@/lib/auth-session";
import { getClientAccountForUser } from "@/lib/data-access";

export const metadata: Metadata = {
  title: {
    default: "Client Portal",
    template: "%s · Client Portal · theForge",
  },
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("client");
  const account = await getClientAccountForUser(session.user.id);
  if (!account) redirect("/login?error=client-account-required");
  const initials = session.user.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppShell
      roleLabel="Client Portal"
      navLabel={account.client.name}
      navItems={portalNav}
      userName={session.user.name}
      userSubtitle={account.title}
      userInitials={initials}
      theme={session.user.theme === "light" ? "light" : "dark"}
    >
      {children}
    </AppShell>
  );
}
