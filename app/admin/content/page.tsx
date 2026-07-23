import type { Metadata } from "next";

import { ContentManager } from "@/components/admin/content-manager";
import { getContentPosts } from "@/lib/data-access";

export const metadata: Metadata = { title: "Content" };

export default async function AdminContentPage() {
  const posts = await getContentPosts();
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
        posts={posts.map((post) => ({
          ...post,
          updatedAt: post.updatedAt.toISOString().slice(0, 10),
        }))}
      />
    </div>
  );
}
