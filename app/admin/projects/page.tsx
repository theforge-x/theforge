import type { Metadata } from "next";

import { ProjectsManager } from "@/components/admin/projects-manager";
import { getAllProjects, getClients } from "@/lib/data-access";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  const [projects, clients] = await Promise.all([
    getAllProjects(),
    getClients(),
  ]);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">Projects</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Every build in flight, across every client.
        </p>
      </div>

      <ProjectsManager
        projects={projects}
        clients={clients.map(({ id, name }) => ({ id, name }))}
      />
    </div>
  );
}
