import type { Metadata } from "next";

import { ContentManager } from "@/components/admin/content-manager";
import { getAllProjects, getContentPosts } from "@/lib/data-access";

export const metadata: Metadata = { title: "Content" };

export default async function AdminContentPage() {
  const [posts, projects] = await Promise.all([
    getContentPosts(),
    getAllProjects(),
  ]);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">Content</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Create, revise, publish, and remove marketing articles and case
          studies.
        </p>
      </div>
      <ContentManager
        projects={projects.map((project) => ({
          id: project.id,
          name: project.name,
          clientName: project.clientName,
        }))}
        posts={posts.map((post) => ({
          ...post,
          updatedAt: post.updatedAt.toISOString().slice(0, 10),
        }))}
      />
    </div>
  );
}
