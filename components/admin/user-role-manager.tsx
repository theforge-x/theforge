"use client";

import { Loader2, Pencil, ShieldBan, Trash2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  clientId: string | null;
};

export function UserRoleManager({
  users,
  clients,
  currentUserId,
}: {
  users: ManagedUser[];
  clients: { id: string; name: string }[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [editing, setEditing] = useState<ManagedUser | null>(null);

  async function saveMembership(userId: string, clientId: string | null) {
    const response = await fetch("/api/admin/membership", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, clientId }),
    });
    if (!response.ok) throw new Error("Could not update client access");
  }

  async function changeRole(
    userId: string,
    role: "admin" | "client" | "sales",
  ) {
    setPending(userId);
    const result = await authClient.admin.setRole({ userId, role });
    if (result.error)
      toast.error(result.error.message ?? "Could not update role");
    else {
      if (role !== "client") await saveMembership(userId, null);
      toast.success("Role updated");
      router.refresh();
    }
    setPending(null);
  }

  async function createUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setPending("create");
    const form = new FormData(formElement);
    const role = String(form.get("role")) as "admin" | "client" | "sales";
    const clientId = String(form.get("clientId") || "") || null;
    try {
      const result = await authClient.admin.createUser({
        name: String(form.get("name")),
        email: String(form.get("email")),
        password: String(form.get("password")),
        role,
      });
      if (result.error || !result.data?.user)
        throw new Error(result.error?.message ?? "Could not create user");
      if (role === "client")
        await saveMembership(result.data.user.id, clientId);
      toast.success("User created");
      formElement.reset();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create user",
      );
    } finally {
      setPending(null);
    }
  }

  async function updateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setPending(editing.id);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/admin/users/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!response.ok)
        throw new Error(result?.error ?? "Could not update user");
      const password = String(form.get("password") ?? "");
      if (password) {
        const passwordResult = await authClient.admin.setUserPassword({
          userId: editing.id,
          newPassword: password,
        });
        if (passwordResult.error)
          throw new Error(
            passwordResult.error.message ?? "Could not change password",
          );
      }
      toast.success("User updated");
      setEditing(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update user",
      );
    } finally {
      setPending(null);
    }
  }

  async function toggleBan(managedUser: ManagedUser) {
    if (managedUser.id === currentUserId) return;
    setPending(managedUser.id);
    const result = managedUser.banned
      ? await authClient.admin.unbanUser({ userId: managedUser.id })
      : await authClient.admin.banUser({
          userId: managedUser.id,
          banReason: "Disabled by administrator",
        });
    if (result.error)
      toast.error(result.error.message ?? "Could not update account status");
    else {
      toast.success(managedUser.banned ? "User restored" : "User banned");
      router.refresh();
    }
    setPending(null);
  }

  async function removeUser(managedUser: ManagedUser) {
    if (
      managedUser.id === currentUserId ||
      !window.confirm(`Delete ${managedUser.name}'s account?`)
    )
      return;
    setPending(managedUser.id);
    const result = await authClient.admin.removeUser({
      userId: managedUser.id,
    });
    if (result.error)
      toast.error(result.error.message ?? "Could not delete user");
    else {
      toast.success("User deleted");
      router.refresh();
    }
    setPending(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create user</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createUser} className="grid gap-4 lg:grid-cols-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-name">Name</Label>
              <Input id="new-name" name="name" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-email">Email</Label>
              <Input id="new-email" name="email" type="email" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-password">Temporary password</Label>
              <Input
                id="new-password"
                name="password"
                type="password"
                minLength={12}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <Select name="role" defaultValue="client">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="sales">Sales representative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Client workspace</Label>
              <Select name="clientId">
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="lg:col-span-5 lg:justify-self-start"
              disabled={pending === "create"}
            >
              {pending === "create" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UserPlus className="size-4" />
              )}{" "}
              Create user
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Client workspace</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role ?? "client"}
                      onValueChange={(value) =>
                        changeRole(
                          user.id,
                          value as "admin" | "client" | "sales",
                        )
                      }
                      disabled={pending === user.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="sales">
                          Sales representative
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {user.role !== "client" ? (
                      <span className="text-muted-foreground text-sm">
                        {user.role === "admin"
                          ? "All workspaces"
                          : "Sales workspace"}
                      </span>
                    ) : (
                      <Select
                        value={user.clientId ?? "unassigned"}
                        onValueChange={async (value) => {
                          setPending(user.id);
                          await saveMembership(
                            user.id,
                            value === "unassigned" ? null : value,
                          );
                          toast.success("Client access updated");
                          router.refresh();
                          setPending(null);
                        }}
                        disabled={pending === user.id}
                      >
                        <SelectTrigger className="w-52">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.banned ? "destructive" : "success"}>
                      {user.banned ? "Banned" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Edit ${user.name}`}
                        onClick={() => setEditing(user)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={
                          user.banned
                            ? `Restore ${user.name}`
                            : `Ban ${user.name}`
                        }
                        disabled={
                          pending === user.id || user.id === currentUserId
                        }
                        onClick={() => toggleBan(user)}
                      >
                        <ShieldBan />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete ${user.name}`}
                        disabled={
                          pending === user.id || user.id === currentUserId
                        }
                        onClick={() => removeUser(user)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              Update identity details or set a new password. Roles and workspace
              access remain editable in the table.
            </DialogDescription>
          </DialogHeader>
          {editing ? (
            <form onSubmit={updateUser} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input name="name" defaultValue={editing.name} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={editing.email}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>New password</Label>
                <Input
                  name="password"
                  type="password"
                  minLength={12}
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </Button>
                <Button variant="ember" disabled={pending === editing.id}>
                  {pending === editing.id ? (
                    <Loader2 className="animate-spin" />
                  ) : null}{" "}
                  Save user
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
