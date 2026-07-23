import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { BrandMark } from "@/components/brand-mark";
import { getSession, hasRole } from "@/lib/auth-session";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const [session, query] = await Promise.all([getSession(), searchParams]);
  if (session)
    redirect(
      hasRole(session.user.role, "admin")
        ? "/admin"
        : hasRole(session.user.role, "sales")
          ? "/sales"
          : "/portal",
    );

  return (
    <main className="grain-overlay bg-forge-black flex min-h-svh flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="mb-10 flex items-center gap-2.5">
        <BrandMark className="size-8" />
        <span className="font-display text-xl tracking-wide">theForge</span>
      </Link>
      <div className="border-border bg-card w-full max-w-sm rounded-lg border p-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl">Welcome back</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Sign in to your assigned workspace.
          </p>
        </div>
        {query.error ? (
          <p className="text-destructive mb-4 text-sm">
            Your account is not linked to a client workspace. Contact an
            administrator.
          </p>
        ) : null}
        <LoginForm nextPath={query.next} />
      </div>
    </main>
  );
}
