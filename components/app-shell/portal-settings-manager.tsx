"use client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

type Profile = {
  name: string;
  email: string;
  title: string;
  notifyReports: boolean;
  notifyInvoices: boolean;
  notifyProjects: boolean;
  notifyMonthly: boolean;
};
export function PortalSettingsManager({ profile }: { profile: Profile }) {
  const [prefs, setPrefs] = useState({
    notifyReports: profile.notifyReports,
    notifyInvoices: profile.notifyInvoices,
    notifyProjects: profile.notifyProjects,
    notifyMonthly: profile.notifyMonthly,
  });
  const [pending, setPending] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const fields = Object.fromEntries(new FormData(e.currentTarget));
      const response = await fetch("/api/account/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, ...prefs }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Could not save settings");
      toast.success("Settings saved");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save settings",
      );
    } finally {
      setPending(false);
    }
  }
  const toggles = [
    { key: "notifyReports", label: "New report delivered" },
    { key: "notifyInvoices", label: "Invoice due reminders" },
    { key: "notifyProjects", label: "Project phase updates" },
    { key: "notifyMonthly", label: "Monthly performance summary" },
  ] as const;
  return (
    <form onSubmit={submit} className="flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your account details for the client portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Full name</Label>
            <Input name="name" defaultValue={profile.name} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Role</Label>
            <Input name="title" defaultValue={profile.title} required />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              defaultValue={profile.email}
              required
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose the updates you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {toggles.map((item, index) => (
            <div key={item.key}>
              {index ? <Separator /> : null}
              <div className="flex items-center justify-between py-3">
                <span className="text-sm">{item.label}</span>
                <Switch
                  checked={prefs[item.key]}
                  onCheckedChange={(checked) =>
                    setPrefs((current) => ({ ...current, [item.key]: checked }))
                  }
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Button variant="ember" className="self-start" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : null} Save changes
      </Button>
    </form>
  );
}
