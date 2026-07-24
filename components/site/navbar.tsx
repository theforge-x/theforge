"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const MOBILE_MENU_ID = "site-mobile-navigation";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [studioName, setStudioName] = useState("theForge");
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const updateScrollState = () => {
      frame = 0;
      setScrolled(window.scrollY > 40);
    };

    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then((response) => (response.ok ? response.json() : null))
      .then((settings) => {
        if (settings?.studioName) setStudioName(settings.studioName);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handlePointerDown = (event: PointerEvent) => {
      if (!mobileNavRef.current?.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleDesktopChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleDesktopChange);
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 z-50 transition-[top] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
        scrolled ? "top-3 lg:top-4" : "top-0",
      )}
    >
      <nav aria-label="Primary navigation" className="hidden lg:block">
        <div
          className={cn(
            "pointer-events-auto relative mx-auto flex items-center transition-[max-width,height,padding,background-color,border-color,border-radius,box-shadow,backdrop-filter] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
            scrolled
              ? "h-14 max-w-[70rem] rounded-full border border-border/60 bg-background/80 px-3 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-[18px] backdrop-saturate-[1.8]"
              : "h-[72px] max-w-full border border-transparent bg-transparent px-8",
          )}
        >
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label={`${studioName} home`}
          >
            <BrandMark
              className={cn(
                "transition-[width,height] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
                scrolled ? "size-6" : "size-7",
              )}
            />
            <span
              className={cn(
                "font-display font-semibold tracking-tight transition-[font-size] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
                scrolled ? "text-lg" : "text-xl",
              )}
            >
              {studioName}
            </span>
          </Link>

          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-7">
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative py-2 text-sm font-medium transition-colors duration-300",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 bottom-0 h-px origin-center bg-primary transition-transform duration-300 ease-out motion-reduce:transition-none",
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size={scrolled ? "sm" : "default"} asChild>
              <Link href="/portal">Client portal</Link>
            </Button>
            <Button size={scrolled ? "sm" : "default"} asChild>
              <Link href="/book">
                Book a growth audit
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <nav aria-label="Mobile navigation" className="relative lg:hidden">
        <button
          type="button"
          aria-label="Close navigation menu"
          tabIndex={mobileOpen ? 0 : -1}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "pointer-events-auto fixed inset-0 z-0 bg-black/20 backdrop-blur-sm transition-[opacity,visibility] duration-300 motion-reduce:transition-none",
            mobileOpen ? "visible opacity-100" : "invisible opacity-0",
          )}
        />
        <div ref={mobileNavRef} className="relative z-10">
          <div
            className={cn(
              "pointer-events-auto mx-auto transition-[margin,background-color,border-color,border-radius,box-shadow,backdrop-filter] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
              scrolled && "mx-3",
              scrolled || mobileOpen
                ? "border-x border-t border-border/60 bg-background/90 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-[18px] backdrop-saturate-[1.8]"
                : "border-x border-t border-transparent bg-transparent",
              mobileOpen ? "rounded-t-[1.5rem]" : "rounded-full border-b",
            )}
          >
            <div className="flex h-14 items-center justify-between px-4">
              <Link
                href="/"
                className="flex min-w-0 items-center gap-2.5"
                aria-label={`${studioName} home`}
              >
                <BrandMark className="size-6 shrink-0" />
                <span className="truncate font-display text-lg font-semibold tracking-tight">
                  {studioName}
                </span>
              </Link>

              <button
                type="button"
                aria-label={
                  mobileOpen ? "Close navigation menu" : "Open navigation menu"
                }
                aria-expanded={mobileOpen}
                aria-controls={MOBILE_MENU_ID}
                onClick={() => setMobileOpen((open) => !open)}
                className="grid size-10 shrink-0 place-items-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span
                  className="relative grid size-5 place-items-center"
                  aria-hidden="true"
                >
                  <Menu
                    className={cn(
                      "absolute size-5 transition-[opacity,transform] duration-300 motion-reduce:transition-none",
                      mobileOpen
                        ? "rotate-90 scale-75 opacity-0"
                        : "rotate-0 scale-100 opacity-100",
                    )}
                  />
                  <X
                    className={cn(
                      "absolute size-5 transition-[opacity,transform] duration-300 motion-reduce:transition-none",
                      mobileOpen
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-90 scale-75 opacity-0",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>

          <div
            id={MOBILE_MENU_ID}
            aria-hidden={!mobileOpen}
            className={cn(
              "pointer-events-auto grid transition-[grid-template-rows,opacity,transform,margin] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
              scrolled && "mx-3",
              mobileOpen
                ? "grid-rows-[1fr] translate-y-0 opacity-100"
                : "pointer-events-none grid-rows-[0fr] -translate-y-2 opacity-0",
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-b-[1.5rem] border-x border-b border-border/60 bg-background/90 px-3 pb-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-[18px] backdrop-saturate-[1.8]">
                <div className="border-t border-border/50 pt-2">
                  {links.map((link, index) => {
                    const active = isActive(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        tabIndex={mobileOpen ? 0 : -1}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "group flex items-center justify-between rounded-xl px-3 py-3.5 text-lg font-medium transition-colors",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted",
                        )}
                      >
                        <span>{link.label}</span>
                        <span className="font-mono text-[0.65rem] text-muted-foreground transition-colors group-hover:text-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-3 grid gap-2 border-t border-border/50 pt-4 sm:grid-cols-2">
                  <Button variant="outline" asChild>
                    <Link href="/portal" tabIndex={mobileOpen ? 0 : -1}>
                      Client portal
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/book" tabIndex={mobileOpen ? 0 : -1}>
                      Book a growth audit
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
