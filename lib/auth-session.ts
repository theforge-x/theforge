import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export type AppRole = "admin" | "client" | "sales";

export function hasRole(roleValue: string | null | undefined, role: AppRole) {
  return (roleValue ?? "")
    .split(",")
    .map((value) => value.trim())
    .includes(role);
}

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireRole(role: AppRole) {
  const session = await getSession();
  if (!session) redirect(`/login?next=/${role === "client" ? "portal" : role}`);

  if (!hasRole(session.user.role, role)) {
    redirect(
      hasRole(session.user.role, "admin")
        ? "/admin"
        : hasRole(session.user.role, "sales")
          ? "/sales"
          : "/portal",
    );
  }

  return session;
}

export async function requireAnyRole(roles: AppRole[]) {
  const session = await getSession();
  if (!session) redirect(`/login?next=/sales`);
  if (!roles.some((role) => hasRole(session.user.role, role))) {
    redirect(hasRole(session.user.role, "client") ? "/portal" : "/admin");
  }
  return session;
}
