import { listAvailableSlots } from "@/lib/availability";
export async function GET() {
  return Response.json({ slots: await listAvailableSlots() });
}
