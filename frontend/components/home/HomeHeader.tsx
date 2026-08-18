"use client";

import { useState } from "react";
import Link from "next/link";
import { Boxes, Menu, X } from "lucide-react";
import AuthActions from "./AuthActions";

const navigation = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export default function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface-primary">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="InventoryPro home"
          className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-subtle-accent/30 focus-visible:ring-offset-2"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-sidebar text-surface-primary">
            <Boxes className="size-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-text-primary">
            InventoryPro
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Homepage navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary outline-none hover:bg-neutral-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-subtle-accent/30 active:bg-border"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <AuthActions />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="homepage-mobile-navigation"
          className="flex size-9 items-center justify-center rounded-md border border-border-strong bg-surface-raised text-text-secondary shadow-xs outline-none hover:border-subtle-accent hover:bg-neutral-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-subtle-accent/30 focus-visible:ring-offset-2 active:bg-border md:hidden"
        >
          {menuOpen ? (
            <X className="size-4" aria-hidden="true" />
          ) : (
            <Menu className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="homepage-mobile-navigation"
          className="border-t border-border bg-surface-primary px-4 py-3 md:hidden"
          aria-label="Mobile homepage navigation"
        >
          <div className="mx-auto max-w-7xl space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-text-secondary outline-none hover:bg-neutral-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-subtle-accent/30 active:bg-border"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-border pt-3">
              <AuthActions fullWidth />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
