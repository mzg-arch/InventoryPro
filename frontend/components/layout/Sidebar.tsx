"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, LayoutDashboard, LogOut, Truck } from "lucide-react";

interface LoggedInUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Products", path: "/products", icon: Boxes },
  { label: "Suppliers", path: "/suppliers", icon: Truck },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user] = useState<LoggedInUser | null>(() => {
    if (typeof window === "undefined") return null;
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    return JSON.parse(storedUser);
  });

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-hover bg-sidebar px-3 py-4 text-surface-primary md:flex">
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-3 rounded-md px-2 py-1.5 text-left outline-none hover:bg-surface-primary/5 focus-visible:ring-2 focus-visible:ring-surface-primary/35"
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-surface-primary text-sidebar">
          <Boxes className="size-4" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-sm font-semibold tracking-tight">
            InventoryPro
          </span>
          <span className="block text-[11px] text-text-muted">
            Inventory workspace
          </span>
        </span>
      </button>

      <nav className="mt-7 flex-1" aria-label="Primary navigation">
        <p className="px-2 text-[10px] font-semibold tracking-[0.14em] text-text-muted uppercase">
          Workspace
        </p>
        <div className="mt-2 space-y-1">
          {navigation.map(({ label, path, icon: Icon }) => {
            const active =
              pathname === path ||
              (path !== "/dashboard" && pathname.startsWith(`${path}/`));

            return (
              <button
                key={path}
                onClick={() => router.push(path)}
                aria-current={active ? "page" : undefined}
                className={`flex h-9 w-full items-center gap-3 rounded-md px-2.5 text-left text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-surface-primary/35 ${
                  active
                    ? "bg-sidebar-active text-surface-primary shadow-sm"
                    : "text-text-muted hover:bg-sidebar-hover hover:text-surface-primary active:bg-sidebar-active"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-sidebar-hover pt-3">
        {user && (
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-hover text-xs font-semibold text-surface-secondary ring-1 ring-surface-primary/10">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-surface-secondary">
                {user.name}
              </p>
              <p className="truncate text-[11px] text-text-muted">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-1 flex h-9 w-full items-center gap-3 rounded-md px-2.5 text-left text-sm font-medium text-text-muted outline-none hover:bg-sidebar-hover hover:text-surface-primary focus-visible:ring-2 focus-visible:ring-surface-primary/35 active:bg-sidebar-active"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Log out
        </button>
      </div>
    </aside>
  );
}
