"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { saveAdminResource } from "@/components/admin/admin-resource";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";

type Settings = {
  studioName: string;
  billingEmail: string;
  publicEmail: string;
  phone: string;
  tagline: string;
  appointmentDuration: number;
  notifyNewClient: boolean;
  notifyOverdueInvoice: boolean;
  notifyWeeklyDigest: boolean;
};

export function SettingsManager({
  settings,
  team,
}: {
  settings: Settings;
  team: { id: string; name: string; email: string; banned: boolean }[];
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    newClient: settings.notifyNewClient,
    overdue: settings.notifyOverdueInvoice,
    digest: settings.notifyWeeklyDigest,
  });
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      await saveAdminResource("settings", "PUT", {
        studioName: String(form.get("studioName")),
        billingEmail: String(form.get("billingEmail")),
        publicEmail: String(form.get("publicEmail")),
        phone: String(form.get("phone")),
        tagline: String(form.get("tagline")),
        appointmentDuration: Number(form.get("appointmentDuration")),
        notifyNewClient: notifications.newClient,
        notifyOverdueInvoice: notifications.overdue,
        notifyWeeklyDigest: notifications.digest,
      });
      toast.success("Studio settings saved");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save settings",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Studio profile</CardTitle>
          <CardDescription>
            Shown on invoices and client-facing reports.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="studio-name">Studio name</Label>
            <Input
              id="studio-name"
              name="studioName"
              defaultValue={settings.studioName}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="public-email">Public email</Label>
              <Input
                id="public-email"
                name="publicEmail"
                type="email"
                defaultValue={settings.publicEmail}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="public-phone">Public phone</Label>
              <Input
                id="public-phone"
                name="phone"
                defaultValue={settings.phone}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tagline">Site tagline</Label>
            <Input
              id="tagline"
              name="tagline"
              defaultValue={settings.tagline}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="appointment-duration">
              Appointment duration (minutes)
            </Label>
            <Input
              id="appointment-duration"
              name="appointmentDuration"
              type="number"
              min={15}
              max={240}
              defaultValue={settings.appointmentDuration}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="studio-email">Billing email</Label>
            <Input
              id="studio-email"
              name="billingEmail"
              type="email"
              defaultValue={settings.billingEmail}
              required
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <div>
            <CardTitle>Team</CardTitle>
            <CardDescription>
              People with admin access to this workspace.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/users">Manage access</Link>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          {team.map((member) => {
            const initials = member.name
              .split(/\s+/)
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            return (
              <div
                key={member.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {member.name}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      {member.email}
                    </div>
                  </div>
                </div>
                <Badge variant={member.banned ? "destructive" : "success"}>
                  {member.banned ? "Banned" : "Active"}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose the operational events the studio should surface.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          <div className="flex items-center justify-between py-3">
            <Label htmlFor="notify-new-client">New client signed</Label>
            <Switch
              id="notify-new-client"
              checked={notifications.newClient}
              onCheckedChange={(value) =>
                setNotifications((state) => ({ ...state, newClient: value }))
              }
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <Label htmlFor="notify-overdue">Invoice overdue alerts</Label>
            <Switch
              id="notify-overdue"
              checked={notifications.overdue}
              onCheckedChange={(value) =>
                setNotifications((state) => ({ ...state, overdue: value }))
              }
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <Label htmlFor="notify-digest">Weekly studio digest</Label>
            <Switch
              id="notify-digest"
              checked={notifications.digest}
              onCheckedChange={(value) =>
                setNotifications((state) => ({ ...state, digest: value }))
              }
            />
          </div>
        </CardContent>
      </Card>
      <Button variant="ember" className="self-start" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : null} Save all
        settings
      </Button>
    </form>
  );
}
