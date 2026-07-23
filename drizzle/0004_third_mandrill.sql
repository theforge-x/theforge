ALTER TABLE "sales_quotes" ADD COLUMN "discovery" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_quotes" ADD COLUMN "deposit_percent" integer DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_quotes" ADD COLUMN "estimated_timeline" text DEFAULT '4–6 weeks' NOT NULL;