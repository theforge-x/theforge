import { auth } from "@/lib/auth";
import { hasRole } from "@/lib/auth-session";

export async function getSalesApiSession(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (
    !session ||
    (!hasRole(session.user.role, "admin") &&
      !hasRole(session.user.role, "sales"))
  )
    return null;
  return session;
}
