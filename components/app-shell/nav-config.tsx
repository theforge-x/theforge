import {
  CalendarClock,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessagesSquare,
  Newspaper,
  Presentation,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

export type NavItem = {
  title: string;
  href: string;
  icon: ReactNode;
};

export const portalNav: NavItem[] = [
  { title: "Dashboard", href: "/portal", icon: <LayoutDashboard /> },
  { title: "Projects", href: "/portal/projects", icon: <FolderKanban /> },
  { title: "Reports", href: "/portal/reports", icon: <FileText /> },
  { title: "Invoices", href: "/portal/invoices", icon: <Receipt /> },
  { title: "Settings", href: "/portal/settings", icon: <Settings /> },
];

export const adminNav: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: <LayoutDashboard /> },
  { title: "Clients", href: "/admin/clients", icon: <Users /> },
  { title: "Enquiries", href: "/admin/enquiries", icon: <MessagesSquare /> },
  {
    title: "Appointments",
    href: "/admin/appointments",
    icon: <CalendarClock />,
  },
  { title: "Users & roles", href: "/admin/users", icon: <ShieldCheck /> },
  { title: "Projects", href: "/admin/projects", icon: <FolderKanban /> },
  { title: "Blog", href: "/admin/content", icon: <Newspaper /> },
  { title: "Sales workspace", href: "/sales", icon: <Presentation /> },
  { title: "Settings", href: "/admin/settings", icon: <Settings /> },
];

export const salesNav: NavItem[] = [
  { title: "Sales dashboard", href: "/sales", icon: <LayoutDashboard /> },
  { title: "Leads", href: "/sales/leads", icon: <Users /> },
  { title: "Quotes", href: "/sales/quotes", icon: <ScrollText /> },
  { title: "Website demos", href: "/sales/demos", icon: <Presentation /> },
];
