import { EnquiriesManager } from "@/components/admin/enquiries-manager";
import { getContactEnquiries } from "@/lib/data-access";
export const metadata = { title: "Contact enquiries" };
export default async function EnquiriesPage() {
  const enquiries = await getContactEnquiries();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">Contact enquiries</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Review and qualify messages without creating client records.
        </p>
      </div>
      <EnquiriesManager
        enquiries={enquiries.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString().slice(0, 10),
        }))}
      />
    </div>
  );
}
