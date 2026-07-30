import { TheForgeOsWorkspace } from "@/components/os/theforge-os-workspace";
import { getOsWorkspaceData } from "./actions";

export default async function TheForgeOsPage() {
  const data = await getOsWorkspaceData();
  return <TheForgeOsWorkspace initialData={data} />;
}
