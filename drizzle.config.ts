import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path:
    process.env.NODE_ENV === "production"
      ? [".env.production.local", ".env.production", ".env.local", ".env"]
      : [".env.local", ".env"],
  quiet: true,
});

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url:
      (process.env.NODE_ENV === "production"
        ? process.env.DATABASE_URL_UNPOOLED
        : undefined) ??
      process.env.DATABASE_URL ??
      "postgresql://theforge:theforge@localhost:6543/theforge",
  },
  strict: true,
  verbose: true,
});
