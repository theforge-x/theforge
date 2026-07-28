import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

import { accessControl, authRoles } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { schema } from "@/lib/db/schema";
import { getSiteUrl } from "@/lib/site-url";

export const auth = betterAuth({
  appName: "theForge",
  baseURL: getSiteUrl(),
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
  },
  user: {
    additionalFields: {
      theme: {
        type: "string",
        required: false,
        defaultValue: "dark",
        input: false,
      },
      notifyReports: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
      },
      notifyInvoices: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
      },
      notifyProjects: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
      },
      notifyMonthly: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  plugins: [
    admin({
      ac: accessControl,
      roles: authRoles,
      defaultRole: "client",
      adminRoles: ["admin"],
    }),
    nextCookies(),
  ],
});
