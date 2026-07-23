CREATE TABLE "content_posts" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"kind" text DEFAULT 'article' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studio_settings" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"studio_name" text DEFAULT 'The Forge' NOT NULL,
	"billing_email" text DEFAULT 'billing@theforge.studio' NOT NULL,
	"notify_new_client" boolean DEFAULT true NOT NULL,
	"notify_overdue_invoice" boolean DEFAULT true NOT NULL,
	"notify_weekly_digest" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "content_posts_slug_idx" ON "content_posts" USING btree ("slug");