import { sql } from "drizzle-orm";
import { caseStudySeeds } from "../lib/case-study-seeds";
import { projects as seedProjects } from "../lib/data";
import { db, pool } from "../lib/db";
import { contentPosts, projects } from "../lib/db/schema";

async function main() {
  const linkedProjectIds = new Set(
    caseStudySeeds.map((study) => study.projectId),
  );
  const linkedProjects = seedProjects
    .filter((project) => linkedProjectIds.has(project.id))
    .map(({ clientName: _clientName, ...project }) => project);

  await db.insert(projects).values(linkedProjects).onConflictDoNothing();

  for (const study of caseStudySeeds) {
    await db
      .insert(contentPosts)
      .values({
        ...study,
        kind: "case-study",
        status: "published",
        publishedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: contentPosts.slug,
        set: {
          projectId: study.projectId,
          title: study.title,
          kind: "case-study",
          status: "published",
          excerpt: study.excerpt,
          body: study.body,
          category: study.category,
          featuredImage: study.featuredImage,
          seoTitle: study.seoTitle,
          seoDescription: study.seoDescription,
          publishedAt: sql`coalesce(${contentPosts.publishedAt}, now())`,
        },
      });
  }

  console.info(
    `Published ${caseStudySeeds.length} project-linked case studies.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
