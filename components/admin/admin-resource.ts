export type AdminResource =
  | "clients"
  | "projects"
  | "invoices"
  | "reports"
  | "content"
  | "enquiries"
  | "appointments"
  | "settings";

export async function saveAdminResource(
  resource: AdminResource,
  method: "POST" | "PUT",
  value: Record<string, unknown>,
) {
  const response = await fetch(`/api/admin/resources/${resource}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  const result = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;
  if (!response.ok) throw new Error(result?.error ?? "Could not save changes");
}

export async function deleteAdminResource(
  resource: Exclude<AdminResource, "settings">,
  id: string,
) {
  const response = await fetch(
    `/api/admin/resources/${resource}?id=${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
  const result = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;
  if (!response.ok) throw new Error(result?.error ?? "Could not delete record");
}
