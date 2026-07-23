import { z } from "zod";
import { db } from "@/lib/db";
import { contactEnquiries } from "@/lib/db/schema";

const enquirySchema = z.object({
  name: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(60).optional(),
  company: z.string().trim().max(160).optional(),
  service: z.string().trim().max(160).optional(),
  budget: z.string().trim().max(80).optional(),
  message: z.string().trim().min(10).max(5000),
});

export async function POST(request: Request) {
  try {
    const value = enquirySchema.parse(await request.json());
    const [enquiry] = await db
      .insert(contactEnquiries)
      .values(value)
      .returning({ id: contactEnquiries.id });
    return Response.json({ ok: true, id: enquiry.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: error.issues[0]?.message ?? "Invalid enquiry" },
        { status: 400 },
      );
    }
    return Response.json(
      { error: "Could not submit your enquiry." },
      { status: 500 },
    );
  }
}
