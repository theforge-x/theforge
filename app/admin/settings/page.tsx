import { asc } from "drizzle-orm";

import { SettingsManager } from "@/components/admin/settings-manager";
import { hasRole } from "@/lib/auth-session";
import { getStudioSettings } from "@/lib/data-access";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

export default async function AdminSettingsPage() {
  const [settings, users] = await Promise.all([
    getStudioSettings(),
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        banned: user.banned,
      })
      .from(user)
      .orderBy(asc(user.name)),
  ]);
  const team = users.filter((member) => hasRole(member.role, "admin"));
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">Settings</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Studio configuration, notifications, and team access.
        </p>
      </div>
      <SettingsManager settings={settings} team={team} />
    </div>
  );
}
