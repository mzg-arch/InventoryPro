"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, LayoutDashboard, LogOut, Menu, Truck, X } from "lucide-react";
import Sidebar from "./Sidebar";

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Products", path: "/products", icon: Boxes },
  { label: "Suppliers", path: "/suppliers", icon: Truck },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  function navigate(path: string) {
    router.push(path);
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-page-background">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-border bg-surface-primary px-4 md:hidden">
            <div className="flex h-14 items-center justify-between gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex min-w-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-subtle-accent/20 focus-visible:ring-offset-2"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar text-surface-primary">
                  <Boxes className="size-4" aria-hidden="true" />
                </span>
                <span className="truncate text-left text-sm font-semibold text-text-primary">
                  InventoryPro
                </span>
              </button>

              <button
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
                className="flex size-9 items-center justify-center rounded-md border border-border-strong bg-surface-primary text-text-secondary shadow-xs outline-none hover:border-subtle-accent hover:bg-neutral-hover focus-visible:ring-2 focus-visible:ring-subtle-accent/20 focus-visible:ring-offset-2 active:bg-border"
              >
                {mobileMenuOpen ? (
                  <X className="size-4" aria-hidden="true" />
                ) : (
                  <Menu className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>

            {mobileMenuOpen && (
              <nav
                id="mobile-navigation"
                className="border-t border-border py-2"
                aria-label="Mobile navigation"
              >
                {navigation.map(({ label, path, icon: Icon }) => {
                  const active =
                    pathname === path ||
                    (path !== "/dashboard" && pathname.startsWith(`${path}/`));

                  return (
                    <button
                      key={path}
                      onClick={() => navigate(path)}
                      aria-current={active ? "page" : undefined}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-subtle-accent/20 ${
                        active
                          ? "bg-neutral-hover text-text-primary"
                          : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary active:bg-neutral-hover"
                      }`}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {label}
                    </button>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-text-secondary outline-none hover:bg-neutral-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-subtle-accent/20 active:bg-border"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Log out
                </button>
              </nav>
            )}
          </header>

          <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-5 lg:p-6 xl:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
