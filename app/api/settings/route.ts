import { getStudioSettings } from "@/lib/data-access";
export async function GET() {
  const settings = await getStudioSettings();
  return Response.json({
    studioName: settings.studioName,
    publicEmail: settings.publicEmail,
    phone: settings.phone,
    tagline: settings.tagline,
    appointmentDuration: settings.appointmentDuration,
  });
}
