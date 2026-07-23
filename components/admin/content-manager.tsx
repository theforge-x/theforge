"use client";

import { FileText, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  deleteAdminResource,
  saveAdminResource,
} from "@/components/admin/admin-resource";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ContentItem = {
  id: string;
  title: string;
  slug: string;
  kind: string;
  status: string;
  excerpt: string;
  body: string;
  category: string;
  projectId: string | null;
  featuredImage: string | null;
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
};

type ProjectOption = { id: string; name: string; clientName: string };

export function ContentManager({
  posts,
  projects,
}: {
  posts: ContentItem[];
  projects: ProjectOption[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<ContentItem | "new" | null>(null);
  const [pending, setPending] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [kind, setKind] = useState("article");
  const current = editing === "new" ? null : editing;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    try {
      await saveAdminResource("content", current ? "PUT" : "POST", {
        ...Object.fromEntries(new FormData(event.currentTarget)),
        featuredImage,
      });
      toast.success(current ? "Content updated" : "Content created");
      setEditing(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save content",
      );
    } finally {
      setPending(false);
    }
  }

  async function remove(item: ContentItem) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    setPending(true);
    try {
      await deleteAdminResource("content", item.id);
      toast.success("Content deleted");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete content",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button
          variant="ember"
          onClick={() => {
            setFeaturedImage("");
            setKind("article");
            setEditing("new");
          }}
        >
          <Plus /> New post
        </Button>
      </div>
      <Card>
        <CardContent className="flex flex-col divide-y divide-border px-0">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="bg-secondary flex size-9 shrink-0 items-center justify-center rounded-md">
                  <FileText className="text-accent size-4" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {post.title}
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-xs">
                    {post.kind === "case-study" ? "Case study" : "Article"} ·
                    {post.projectId
                      ? ` ${projects.find((project) => project.id === post.projectId)?.name ?? "Linked project"} ·`
                      : ""}
                    Updated {post.updatedAt}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge
                  variant={post.status === "published" ? "success" : "outline"}
                  className="capitalize"
                >
                  {post.status}
                </Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Edit ${post.title}`}
                  onClick={() => {
                    setFeaturedImage(post.featuredImage ?? "");
                    setKind(post.kind);
                    setEditing(post);
                  }}
                >
                  <Pencil />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Delete ${post.title}`}
                  onClick={() => remove(post)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
          {!posts.length ? (
            <p className="text-muted-foreground px-5 py-8 text-center text-sm">
              No content yet. Create the first item.
            </p>
          ) : null}
        </CardContent>
      </Card>
      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {current ? "Edit content" : "New content"}
            </DialogTitle>
            <DialogDescription>
              Draft, publish, and revise articles and case studies from one
              place.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            {current ? (
              <input type="hidden" name="id" value={current.id} />
            ) : null}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>Title</Label>
              <Input name="title" defaultValue={current?.title} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Input
                name="category"
                defaultValue={current?.category ?? "Strategy"}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Featured image URL</Label>
              <Input
                value={
                  featuredImage.startsWith("data:")
                    ? "Uploaded image"
                    : featuredImage
                }
                onChange={(event) => setFeaturedImage(event.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>Or upload featured image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setFeaturedImage(String(reader.result));
                  reader.readAsDataURL(file);
                }}
              />
              <p className="text-muted-foreground text-xs">
                Stored with the post. For production-scale media, configure
                object storage.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>Slug</Label>
              <Input
                name="slug"
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                placeholder="growth-strategy-guide"
                defaultValue={current?.slug}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Type</Label>
              <Select name="kind" value={kind} onValueChange={setKind}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="case-study">Case study</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {kind === "case-study" ? (
              <div className="flex flex-col gap-2">
                <Label>Related work</Label>
                <Select
                  name="projectId"
                  defaultValue={current?.projectId ?? undefined}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.clientName} — {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground text-xs">
                  Public work is coined from this admin-managed project.
                </p>
              </div>
            ) : null}
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={current?.status ?? "draft"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>Excerpt</Label>
              <Textarea
                name="excerpt"
                maxLength={500}
                defaultValue={current?.excerpt}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>Body</Label>
              <Textarea
                name="body"
                className="min-h-64"
                defaultValue={current?.body}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>SEO title</Label>
              <Input
                name="seoTitle"
                maxLength={70}
                defaultValue={current?.seoTitle}
                placeholder="Defaults to the post title"
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>SEO description</Label>
              <Textarea
                name="seoDescription"
                maxLength={170}
                defaultValue={current?.seoDescription}
                placeholder="Defaults to the excerpt"
              />
            </div>
            <DialogFooter className="sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button variant="ember" disabled={pending}>
                {pending ? <Loader2 className="animate-spin" /> : null} Save
                content
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
