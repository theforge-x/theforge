"use client";

import { Moon, Sun } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type DashboardTheme = "light" | "dark";
const ThemeContext = createContext<{
  theme: DashboardTheme;
  toggle: () => void;
} | null>(null);

export function DashboardThemeScope({
  initialTheme,
  children,
}: {
  initialTheme: DashboardTheme;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<DashboardTheme>(initialTheme);
  useEffect(() => {
    const stored = localStorage.getItem("forge-dashboard-theme");
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);
  async function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("forge-dashboard-theme", next);
    await fetch("/api/account/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: next }),
    });
  }
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div
        className={
          theme === "light"
            ? "dashboard-light min-h-svh bg-background text-foreground"
            : "dashboard-dark min-h-svh bg-background text-foreground"
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function DashboardThemeToggle() {
  const value = useContext(ThemeContext);
  if (!value) return null;
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={value.toggle}
      aria-label={`Switch to ${value.theme === "dark" ? "light" : "dark"} theme`}
    >
      {value.theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
