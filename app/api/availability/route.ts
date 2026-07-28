import { listAvailableSlots } from "@/lib/availability";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    return Response.json(
      { slots: await listAvailableSlots() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Could not load availability" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
