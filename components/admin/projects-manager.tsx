"use client";

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProjectView } from "@/lib/data-access";

const phaseVariant = {
  Diagnose: "outline",
  Forge: "default",
  Temper: "ember",
} as const;

export function ProjectsManager({
  projects,
  clients,
}: {
  projects: ProjectView[];
  clients: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<ProjectView | "new" | null>(null);
  const [pending, setPending] = useState(false);
  const current = editing === "new" ? null : editing;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    try {
      await saveAdminResource(
        "projects",
        editing === "new" ? "POST" : "PUT",
        Object.fromEntries(new FormData(event.currentTarget)),
      );
      toast.success(current ? "Project updated" : "Project created");
      setEditing(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save project",
      );
    } finally {
      setPending(false);
    }
  }

  async function remove(project: ProjectView) {
    if (!window.confirm(`Delete ${project.name}?`)) return;
    setPending(true);
    try {
      await deleteAdminResource("projects", project.id);
      toast.success("Project deleted");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete project",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button variant="ember" onClick={() => setEditing("new")}>
          <Plus /> New project
        </Button>
      </div>
      <Card>
        <CardContent className="overflow-x-auto px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="w-24">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.clientName}
                  </TableCell>
                  <TableCell>
                    <Badge variant={phaseVariant[p.phase]}>{p.phase}</Badge>
                  </TableCell>
                  <TableCell className="w-40">
                    <div className="flex items-center gap-2">
                      <Progress value={p.progress} className="w-24" />
                      <span className="text-muted-foreground text-xs">
                        {p.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.owner}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.dueDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Edit ${p.name}`}
                        onClick={() => setEditing(p)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete ${p.name}`}
                        onClick={() => remove(p)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {current ? "Edit project" : "New project"}
            </DialogTitle>
            <DialogDescription>
              Manage ownership, delivery phase, progress, and due date.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            {current ? (
              <input type="hidden" name="id" value={current.id} />
            ) : null}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>Project name</Label>
              <Input name="name" defaultValue={current?.name} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Client</Label>
              <Select
                name="clientId"
                defaultValue={current?.clientId ?? clients[0]?.id}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Phase</Label>
              <Select name="phase" defaultValue={current?.phase ?? "Diagnose"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Diagnose">Diagnose</SelectItem>
                  <SelectItem value="Forge">Forge</SelectItem>
                  <SelectItem value="Temper">Temper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Owner</Label>
              <Input name="owner" defaultValue={current?.owner} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Progress</Label>
              <Input
                name="progress"
                type="number"
                min="0"
                max="100"
                defaultValue={current?.progress ?? 0}
                required
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>Due date</Label>
              <Input
                name="dueDate"
                type="date"
                defaultValue={
                  current?.dueDate ?? new Date().toISOString().slice(0, 10)
                }
                required
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
                project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
