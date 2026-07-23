import { AppointmentsManager } from "@/components/admin/appointments-manager";
import { AvailabilityManager } from "@/components/admin/availability-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAppointments,
  getAvailabilityRules,
  getBlockedDates,
} from "@/lib/data-access";
export const metadata = { title: "Appointments" };
export default async function AppointmentsPage() {
  const [appointments, rules, blocks] = await Promise.all([
    getAppointments(),
    getAvailabilityRules(),
    getBlockedDates(),
  ]);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">Appointments</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Approve requests, reschedule calls, and manage meeting links.
        </p>
      </div>
      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Booked appointments</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings">
          <AppointmentsManager
            appointments={appointments.map((item) => ({
              ...item,
              startsAt: item.startsAt.toISOString(),
            }))}
          />
        </TabsContent>
        <TabsContent value="availability">
          <AvailabilityManager
            rules={rules}
            blocks={blocks.map((item) => ({
              ...item,
              startsAt: item.startsAt.toISOString(),
              endsAt: item.endsAt.toISOString(),
            }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
