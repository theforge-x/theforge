CREATE TYPE "public"."appointment_status" AS ENUM('pending', 'approved', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."enquiry_status" AS ENUM('new', 'contacted', 'qualified', 'closed');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"notes" text DEFAULT '' NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"duration_minutes" integer DEFAULT 30 NOT NULL,
	"status" "appointment_status" DEFAULT 'pending' NOT NULL,
	"meeting_provider" text DEFAULT 'zoom' NOT NULL,
	"meeting_url" text,
	"provider_meeting_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_enquiries" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"company" text,
	"service" text,
	"budget" text,
	"message" text NOT NULL,
	"status" "enquiry_status" DEFAULT 'new' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_posts" ADD COLUMN "category" text DEFAULT 'Strategy' NOT NULL;--> statement-breakpoint
ALTER TABLE "content_posts" ADD COLUMN "featured_image" text;--> statement-breakpoint
ALTER TABLE "content_posts" ADD COLUMN "seo_title" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "content_posts" ADD COLUMN "seo_description" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "studio_settings" ADD COLUMN "public_email" text DEFAULT 'hello@theforge.ng' NOT NULL;--> statement-breakpoint
ALTER TABLE "studio_settings" ADD COLUMN "phone" text DEFAULT '+1 (888) 449-8124' NOT NULL;--> statement-breakpoint
ALTER TABLE "studio_settings" ADD COLUMN "tagline" text DEFAULT 'Growth, forged — not guessed.' NOT NULL;--> statement-breakpoint
ALTER TABLE "studio_settings" ADD COLUMN "appointment_duration" integer DEFAULT 30 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "theme" text DEFAULT 'dark' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "notify_reports" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "notify_invoices" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "notify_projects" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "notify_monthly" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "appointments_starts_at_idx" ON "appointments" USING btree ("starts_at");--> statement-breakpoint
CREATE UNIQUE INDEX "appointments_active_slot_idx" ON "appointments" USING btree ("starts_at") WHERE "appointments"."status" <> 'cancelled';--> statement-breakpoint
CREATE INDEX "contact_enquiries_status_idx" ON "contact_enquiries" USING btree ("status");