"use client";

import { ChevronsUpDown, LogOut, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function UserMenu({
  settingsHref,
  userName,
  userSubtitle,
  userInitials,
}: {
  settingsHref: string;
  userName: string;
  userSubtitle: string;
  userInitials: string;
}) {
  const { isMobile, open } = useSidebar();
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "hover:bg-sidebar-accent flex min-w-0 items-center overflow-hidden rounded-md text-left transition-[width,padding,background-color] data-[state=open]:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            open ? "w-full gap-2.5 p-1.5" : "size-10 justify-center p-1",
          )}
          aria-label={`Open account menu for ${userName}`}
        >
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {open ? (
            <>
              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="truncate text-sm font-medium">{userName}</span>
                <span className="text-sidebar-foreground/50 truncate text-xs">
                  {userSubtitle}
                </span>
              </span>
              <ChevronsUpDown className="text-sidebar-foreground/40 size-4 shrink-0" />
            </>
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={open || isMobile ? "start" : "center"}
        side={open || isMobile ? "top" : "right"}
        sideOffset={8}
        collisionPadding={12}
        className="w-56"
      >
        <DropdownMenuItem asChild>
          <Link href={settingsHref}>
            <SettingsIcon /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={signOut}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
