"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems, siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";
import { AmbienceToggle, ThemeToggle } from "./ThemeToggle";
import { Search } from "./Search";

function LogoMark() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3 rounded-[12px] focus-visible:outline-none"
      aria-label={`${siteConfig.name} home`}
    >
      <span
        aria-hidden
        className="relative grid h-9 w-9 place-items-center rounded-full border border-border bg-bg-card"
      >
        <span className="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_40%_35%,color-mix(in_srgb,var(--accent-teal)_55%,transparent),transparent_70%)] opacity-80" />
        <span className="relative h-2 w-2 rounded-full bg-accent-teal" />
      </span>
      <span className="flex flex-col">
        <span
          className="font-display text-xl font-medium tracking-wide text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {siteConfig.name}
        </span>
        <span className="label-caps text-[0.65rem]">{siteConfig.author}</span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "relative rounded-[12px] px-3 py-2 text-sm transition-colors",
              active
                ? "bg-[color-mix(in_srgb,var(--accent-teal)_12%,transparent)] text-text-primary"
                : "text-text-body hover:bg-[color-mix(in_srgb,var(--bg-card)_80%,transparent)] hover:text-text-primary",
            )}
            aria-current={active ? "page" : undefined}
          >
            {active && (
              <span
                aria-hidden
                className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent-teal"
              />
            )}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-8">
      <LogoMark />
      <NavLinks onNavigate={onNavigate} />
      <div className="mt-auto flex flex-col gap-2">
        <Search />
        <ThemeToggle />
        <AmbienceToggle />
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside
      className="fixed top-0 left-0 z-40 hidden h-screen w-[var(--sidebar-width)] border-r border-border bg-[color-mix(in_srgb,var(--bg-raised)_92%,transparent)] p-5 backdrop-blur-sm lg:block"
      aria-label="Site sidebar"
    >
      <SidebarBody />
    </aside>
  );
}

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[color-mix(in_srgb,var(--bg-raised)_94%,transparent)] backdrop-blur-sm lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <LogoMark />
        <button
          type="button"
          className="rounded-[12px] border border-border px-3 py-2 text-sm text-text-body"
          aria-expanded={open}
          aria-controls="mobile-sheet"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <div
          id="mobile-sheet"
          className="border-t border-border bg-bg-raised px-4 py-5"
          role="dialog"
          aria-label="Navigation menu"
        >
          <SidebarBody onNavigate={() => setOpen(false)} />
        </div>
      )}
    </header>
  );
}
