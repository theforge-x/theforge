import Link from "next/link";
import type { ReactNode } from "react";
import {
  DashboardThemeScope,
  DashboardThemeToggle,
} from "@/components/app-shell/dashboard-theme";
import { HeaderTitle } from "@/components/app-shell/header-title";
import type { NavItem } from "@/components/app-shell/nav-config";
import { SidebarNav } from "@/components/app-shell/sidebar-nav";
import { UserMenu } from "@/components/app-shell/user-menu";
import { BrandMark } from "@/components/brand-mark";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function AppShell({
  roleLabel,
  navLabel,
  navItems,
  userName,
  userSubtitle,
  userInitials,
  theme,
  children,
}: {
  roleLabel: string;
  navLabel: string;
  navItems: NavItem[];
  userName: string;
  userSubtitle: string;
  userInitials: string;
  theme: "light" | "dark";
  children: ReactNode;
}) {
  return (
    <DashboardThemeScope initialTheme={theme}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2.5 px-1">
              <BrandMark className="size-7" />
              <span className="flex min-w-0 flex-col leading-none group-data-[state=collapsed]/sidebar:hidden">
                <span className="font-display text-sm tracking-wide">
                  THE FORGE
                </span>
                <span className="font-mono-eyebrow text-sidebar-foreground/50 text-[10px] uppercase">
                  {roleLabel}
                </span>
              </span>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <SidebarNav label={navLabel} items={navItems} />
          </SidebarContent>

          <SidebarFooter>
            <UserMenu
              settingsHref={
                roleLabel === "Admin"
                  ? "/admin/settings"
                  : roleLabel === "Sales"
                    ? "/sales"
                    : "/portal/settings"
              }
              userName={userName}
              userSubtitle={userSubtitle}
              userInitials={userInitials}
            />
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="border-border/50 bg-background/85 sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur-md">
            <SidebarTrigger />
            <HeaderTitle items={navItems} />
            <div className="ml-auto">
              <DashboardThemeToggle />
            </div>
          </header>
          <div className="flex-1 p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardThemeScope>
  );
}
