import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@/lib/db/schema";

config({
  path:
    process.env.NODE_ENV === "production"
      ? [".env.production.local", ".env.production", ".env.local", ".env"]
      : [".env.local", ".env"],
  quiet: true,
});

function validConnectionString(value: string | undefined) {
  if (!value) return undefined;
  try {
    new URL(value);
    return value;
  } catch {
    return undefined;
  }
}

const connectionString =
  validConnectionString(process.env.DATABASE_URL) ??
  validConnectionString(process.env.DATABASE_URL_UNPOOLED) ??
  "postgresql://theforge:theforge@localhost:6543/theforge";

const globalForDb = globalThis as unknown as { pool?: Pool };

export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString,
    max: process.env.NODE_ENV === "production" ? 10 : 5,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export const db = drizzle({ client: pool, schema });
