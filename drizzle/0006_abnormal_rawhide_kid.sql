CREATE TYPE "public"."os_deal_stage" AS ENUM('target', 'contacted', 'fit_conversation', 'diagnostic', 'proposal', 'closed_won', 'closed_lost', 'pod_finalized', 'kickoff');--> statement-breakpoint
CREATE TYPE "public"."os_deal_type" AS ENUM('new_business', 'renewal', 'expansion');--> statement-breakpoint
CREATE TYPE "public"."os_engagement_status" AS ENUM('unassessed', 'diagnosed', 'scoped', 'pod_ready', 'forging', 'client_review', 'tempering', 'proven');--> statement-breakpoint
CREATE TABLE "os_activity_log" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"workspace_id" text DEFAULT 'theforge-internal' NOT NULL,
	"actor_id" text,
	"actor_name" text DEFAULT 'System' NOT NULL,
	"action" text NOT NULL,
	"target_entity" text NOT NULL,
	"target_id" text DEFAULT '' NOT NULL,
	"target_label" text DEFAULT '' NOT NULL,
	"detail" text DEFAULT '' NOT NULL,
	"before" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"after" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "os_deals" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"workspace_id" text DEFAULT 'theforge-internal' NOT NULL,
	"engagement_id" text NOT NULL,
	"owner_id" text,
	"owner_name" text DEFAULT 'Sales' NOT NULL,
	"client_name" text NOT NULL,
	"contact_name" text DEFAULT '' NOT NULL,
	"type" "os_deal_type" DEFAULT 'new_business' NOT NULL,
	"source" text DEFAULT '' NOT NULL,
	"value_cents" integer DEFAULT 0 NOT NULL,
	"stage" "os_deal_stage" DEFAULT 'target' NOT NULL,
	"next_step" text DEFAULT '' NOT NULL,
	"decision_maker" text DEFAULT '' NOT NULL,
	"sponsor" text DEFAULT '' NOT NULL,
	"fit_notes" text DEFAULT '' NOT NULL,
	"dependencies" text DEFAULT '' NOT NULL,
	"risks" text DEFAULT '' NOT NULL,
	"acceptance_criteria" text DEFAULT '' NOT NULL,
	"sow_generated" boolean DEFAULT false NOT NULL,
	"pod_capacity_checked" boolean DEFAULT false NOT NULL,
	"project_created" boolean DEFAULT false NOT NULL,
	"lost_reason" text DEFAULT '' NOT NULL,
	"stage_entered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "os_diagnostics" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"deal_id" text NOT NULL,
	"business_context" text DEFAULT '' NOT NULL,
	"desired_result" text DEFAULT '' NOT NULL,
	"current_systems" text DEFAULT '' NOT NULL,
	"known_constraints" text DEFAULT '' NOT NULL,
	"budget_range" text DEFAULT '' NOT NULL,
	"timeline" text DEFAULT '' NOT NULL,
	"decision_makers" text DEFAULT '' NOT NULL,
	"existing_access_and_dependencies" text DEFAULT '' NOT NULL,
	"success_measures" text DEFAULT '' NOT NULL,
	"constraint_map" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "os_engagements" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"workspace_id" text DEFAULT 'theforge-internal' NOT NULL,
	"client_name" text NOT NULL,
	"title" text NOT NULL,
	"status" "os_engagement_status" DEFAULT 'unassessed' NOT NULL,
	"current_deal_id" text,
	"current_project_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "os_evidence" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"engagement_id" text NOT NULL,
	"baseline_metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"target_metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"result_metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"measurement_period" text DEFAULT '' NOT NULL,
	"testimonial" text DEFAULT '' NOT NULL,
	"case_study_export" text DEFAULT '' NOT NULL,
	"referral_logged" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "os_handoff_records" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"engagement_id" text NOT NULL,
	"checklist_completed_at" timestamp with time zone,
	"client_signoff_by" text DEFAULT '' NOT NULL,
	"client_signoff_at" timestamp with time zone,
	"systems_inventory" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"stabilization_ends_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "os_pod_assignments" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"workspace_id" text DEFAULT 'theforge-internal' NOT NULL,
	"engagement_id" text NOT NULL,
	"deal_id" text,
	"specialist_id" text,
	"internal_user_id" text,
	"member_name" text NOT NULL,
	"role" text NOT NULL,
	"capacity_percent" integer DEFAULT 20 NOT NULL,
	"primary_assignment" boolean DEFAULT false NOT NULL,
	"backup_assignment" boolean DEFAULT false NOT NULL,
	"contract_checked" boolean DEFAULT false NOT NULL,
	"nda_checked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "os_role_permissions" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"role_id" text NOT NULL,
	"module" text NOT NULL,
	"action" text NOT NULL,
	"scope" text DEFAULT 'none' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "os_scope_lines" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"deal_id" text NOT NULL,
	"module_id" text NOT NULL,
	"module_name" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"price_cents" integer DEFAULT 0 NOT NULL,
	"projected_cost_cents" integer DEFAULT 0 NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "os_specialists" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"workspace_id" text DEFAULT 'theforge-internal' NOT NULL,
	"linked_user_id" text,
	"name" text NOT NULL,
	"type" text DEFAULT 'specialist' NOT NULL,
	"skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"rate_card" text DEFAULT '' NOT NULL,
	"availability" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"timezone" text DEFAULT 'Africa/Lagos' NOT NULL,
	"contract_on_file" boolean DEFAULT false NOT NULL,
	"nda_on_file" boolean DEFAULT false NOT NULL,
	"portfolio_evidence" text DEFAULT '' NOT NULL,
	"performance_scorecard" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"partner_organization" text DEFAULT '' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "os_workspace_roles" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"workspace_id" text DEFAULT 'theforge-internal' NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "os_activity_log" ADD CONSTRAINT "os_activity_log_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "os_deals" ADD CONSTRAINT "os_deals_engagement_id_os_engagements_id_fk" FOREIGN KEY ("engagement_id") REFERENCES "public"."os_engagements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "os_deals" ADD CONSTRAINT "os_deals_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "os_diagnostics" ADD CONSTRAINT "os_diagnostics_deal_id_os_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."os_deals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "os_evidence" ADD CONSTRAINT "os_evidence_engagement_id_os_engagements_id_fk" FOREIGN KEY ("engagement_id") REFERENCES "public"."os_engagements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "os_handoff_records" ADD CONSTRAINT "os_handoff_records_engagement_id_os_engagements_id_fk" FOREIGN KEY ("engagement_id") REFERENCES "public"."os_engagements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "os_pod_assignments" ADD CONSTRAINT "os_pod_assignments_engagement_id_os_engagements_id_fk" FOREIGN KEY ("engagement_id") REFERENCES "public"."os_engagements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "os_pod_assignments" ADD CONSTRAINT "os_pod_assignments_deal_id_os_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."os_deals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "os_pod_assignments" ADD CONSTRAINT "os_pod_assignments_specialist_id_os_specialists_id_fk" FOREIGN KEY ("specialist_id") REFERENCES "public"."os_specialists"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "os_pod_assignments" ADD CONSTRAINT "os_pod_assignments_internal_user_id_user_id_fk" FOREIGN KEY ("internal_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "os_role_permissions" ADD CONSTRAINT "os_role_permissions_role_id_os_workspace_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."os_workspace_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "os_scope_lines" ADD CONSTRAINT "os_scope_lines_deal_id_os_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."os_deals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "os_specialists" ADD CONSTRAINT "os_specialists_linked_user_id_user_id_fk" FOREIGN KEY ("linked_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "os_activity_log_workspace_idx" ON "os_activity_log" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "os_activity_log_actor_idx" ON "os_activity_log" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "os_activity_log_target_idx" ON "os_activity_log" USING btree ("target_entity","target_id");--> statement-breakpoint
CREATE INDEX "os_deals_workspace_idx" ON "os_deals" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "os_deals_engagement_idx" ON "os_deals" USING btree ("engagement_id");--> statement-breakpoint
CREATE INDEX "os_deals_owner_idx" ON "os_deals" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "os_deals_stage_idx" ON "os_deals" USING btree ("stage");--> statement-breakpoint
CREATE UNIQUE INDEX "os_diagnostics_deal_idx" ON "os_diagnostics" USING btree ("deal_id");--> statement-breakpoint
CREATE INDEX "os_diagnostics_completed_idx" ON "os_diagnostics" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "os_engagements_workspace_idx" ON "os_engagements" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "os_engagements_status_idx" ON "os_engagements" USING btree ("status");--> statement-breakpoint
CREATE INDEX "os_evidence_engagement_idx" ON "os_evidence" USING btree ("engagement_id");--> statement-breakpoint
CREATE INDEX "os_handoff_records_engagement_idx" ON "os_handoff_records" USING btree ("engagement_id");--> statement-breakpoint
CREATE INDEX "os_pod_assignments_workspace_idx" ON "os_pod_assignments" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "os_pod_assignments_engagement_idx" ON "os_pod_assignments" USING btree ("engagement_id");--> statement-breakpoint
CREATE INDEX "os_pod_assignments_deal_idx" ON "os_pod_assignments" USING btree ("deal_id");--> statement-breakpoint
CREATE UNIQUE INDEX "os_role_permissions_role_rule_idx" ON "os_role_permissions" USING btree ("role_id","module","action");--> statement-breakpoint
CREATE INDEX "os_role_permissions_role_idx" ON "os_role_permissions" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "os_scope_lines_deal_idx" ON "os_scope_lines" USING btree ("deal_id");--> statement-breakpoint
CREATE INDEX "os_specialists_workspace_idx" ON "os_specialists" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "os_specialists_linked_user_idx" ON "os_specialists" USING btree ("linked_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "os_workspace_roles_workspace_name_idx" ON "os_workspace_roles" USING btree ("workspace_id","name");--> statement-breakpoint
CREATE INDEX "os_workspace_roles_workspace_idx" ON "os_workspace_roles" USING btree ("workspace_id");