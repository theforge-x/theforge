ALTER TABLE "content_posts" ADD COLUMN "project_id" text;--> statement-breakpoint
UPDATE "content_posts"
SET "project_id" = 'p-1'
WHERE "id" = 'content-onyx-case-study'
  AND EXISTS (SELECT 1 FROM "projects" WHERE "id" = 'p-1');--> statement-breakpoint
ALTER TABLE "content_posts" ADD CONSTRAINT "content_posts_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "content_posts_project_id_idx" ON "content_posts" USING btree ("project_id");--> statement-breakpoint
ALTER TABLE "content_posts" ADD CONSTRAINT "case_study_requires_project" CHECK ("content_posts"."kind" <> 'case-study' OR "content_posts"."project_id" IS NOT NULL);
