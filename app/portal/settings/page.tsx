import { eq } from "drizzle-orm";
import { PortalSettingsManager } from "@/components/app-shell/portal-settings-manager";
import { requireRole } from "@/lib/auth-session";
import { getClientAccountForUser } from "@/lib/data-access";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
export default async function PortalSettingsPage() {
  const session = await requireRole("client");
  const [account, [profile]] = await Promise.all([
    getClientAccountForUser(session.user.id),
    db.select().from(user).where(eq(user.id, session.user.id)).limit(1),
  ]);
  if (!account || !profile) return null;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">Settings</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your persistent profile and notification preferences.
        </p>
      </div>
      <PortalSettingsManager
        profile={{
          name: profile.name,
          email: profile.email,
          title: account.title,
          notifyReports: profile.notifyReports,
          notifyInvoices: profile.notifyInvoices,
          notifyProjects: profile.notifyProjects,
          notifyMonthly: profile.notifyMonthly,
        }}
      />
    </div>
  );
}
