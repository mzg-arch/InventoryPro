"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface LoggedInUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user] = useState<LoggedInUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  });

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  function isActive(path: string) {
    return pathname === path;
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-white/10 bg-slate-950 p-6 text-white shadow-2xl md:flex">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-black shadow-lg">
            IP
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight">InventoryPro</h1>
            <p className="text-xs text-slate-400">Smart inventory control</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-lg backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white shadow">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="mt-4 inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-200">
            {user.role}
          </div>
        </div>
      )}

      <nav className="mt-8 flex-1 space-y-2">
        <button
          onClick={() => router.push("/dashboard")}
          className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
            isActive("/dashboard")
              ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40"
              : "text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => router.push("/products")}
          className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
            isActive("/products")
              ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40"
              : "text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          Products
        </button>

        <button
          onClick={() => router.push("/suppliers")}
          className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
            isActive("/suppliers")
              ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40"
              : "text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          Suppliers
        </button>
      </nav>

      <button
        onClick={handleLogout}
        className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-left text-sm font-medium text-red-200 transition hover:bg-red-500 hover:text-white"
      >
        Logout
      </button>
    </aside>
  );
}