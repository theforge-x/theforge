CREATE TYPE "public"."lead_status" AS ENUM('new', 'qualified', 'proposal', 'won', 'lost');--> statement-breakpoint
CREATE TYPE "public"."quote_status" AS ENUM('draft', 'sent', 'accepted', 'declined');--> statement-breakpoint
CREATE TABLE "availability_rules" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"weekday" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"timezone" text DEFAULT 'Africa/Lagos' NOT NULL,
	"slot_interval" integer DEFAULT 30 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blocked_dates" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"reason" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_leads" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"owner_id" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text NOT NULL,
	"phone" text,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"source" text DEFAULT 'quote-builder' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_quotes" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"lead_id" text,
	"owner_id" text,
	"quote_number" text NOT NULL,
	"title" text NOT NULL,
	"status" "quote_status" DEFAULT 'draft' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"items" jsonb NOT NULL,
	"discount_percent" integer DEFAULT 0 NOT NULL,
	"payment_terms" text DEFAULT '50% upfront, 50% on delivery' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"valid_until" date NOT NULL,
	"share_token" text NOT NULL,
	"training_mode" boolean DEFAULT false NOT NULL,
	"scenario" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "website_demos" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"lead_id" text,
	"owner_id" text,
	"title" text NOT NULL,
	"prospect_name" text NOT NULL,
	"template" text DEFAULT 'launch' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"share_token" text NOT NULL,
	"brand" jsonb NOT NULL,
	"blocks" jsonb NOT NULL,
	"reusable" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sales_leads" ADD CONSTRAINT "sales_leads_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_quotes" ADD CONSTRAINT "sales_quotes_lead_id_sales_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."sales_leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_quotes" ADD CONSTRAINT "sales_quotes_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "website_demos" ADD CONSTRAINT "website_demos_lead_id_sales_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."sales_leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "website_demos" ADD CONSTRAINT "website_demos_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "availability_rules_weekday_idx" ON "availability_rules" USING btree ("weekday");--> statement-breakpoint
CREATE INDEX "blocked_dates_starts_at_idx" ON "blocked_dates" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "sales_leads_owner_idx" ON "sales_leads" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sales_quotes_number_idx" ON "sales_quotes" USING btree ("quote_number");--> statement-breakpoint
CREATE UNIQUE INDEX "sales_quotes_share_token_idx" ON "sales_quotes" USING btree ("share_token");--> statement-breakpoint
CREATE INDEX "sales_quotes_owner_idx" ON "sales_quotes" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "website_demos_share_token_idx" ON "website_demos" USING btree ("share_token");--> statement-breakpoint
CREATE INDEX "website_demos_owner_idx" ON "website_demos" USING btree ("owner_id");