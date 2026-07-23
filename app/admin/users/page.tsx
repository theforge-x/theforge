import type { Metadata } from "next";
import { headers } from "next/headers";

import { UserRoleManager } from "@/components/admin/user-role-manager";
import { auth } from "@/lib/auth";
import { getClients } from "@/lib/data-access";
import { db } from "@/lib/db";
import { clientMembers } from "@/lib/db/schema";

export const metadata: Metadata = { title: "Users & roles" };

export default async function AdminUsersPage() {
  const requestHeaders = await headers();
  const [result, clientRows, memberships] = await Promise.all([
    auth.api.listUsers({ query: { limit: 100 }, headers: requestHeaders }),
    getClients(),
    db.select().from(clientMembers),
  ]);
  const session = await auth.api.getSession({ headers: requestHeaders });
  const membershipByUser = new Map(
    memberships.map((item) => [item.userId, item.clientId]),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">Users & roles</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Create accounts, assign admin, sales, or client access, and map client
          users to a workspace.
        </p>
      </div>
      <UserRoleManager
        users={result.users.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          role: item.role ?? null,
          banned: item.banned,
          clientId: membershipByUser.get(item.id) ?? null,
        }))}
        clients={clientRows.map(({ id, name }) => ({ id, name }))}
        currentUserId={session?.user.id ?? ""}
      />
    </div>
  );
}
