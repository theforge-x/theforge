import type { Metadata } from "next";

import { ClientsTable } from "@/components/app-shell/clients-table";
import { getClients } from "@/lib/data-access";

export const metadata: Metadata = { title: "Clients" };

export default async function AdminClientsPage() {
  const clients = await getClients();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">Clients</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Every account currently on the roster.
        </p>
      </div>

      <ClientsTable clients={clients} />
    </div>
  );
}
