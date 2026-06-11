"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur md:hidden">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black text-white shadow">
                  IP
                </div>

                <div className="text-left">
                  <p className="text-sm font-black text-slate-950">
                    InventoryPro
                  </p>
                  <p className="text-xs text-slate-500">Inventory control</p>
                </div>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
              >
                Menu
              </button>
            </div>

            {mobileMenuOpen && (
              <nav className="mt-4 grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                <button
                  onClick={() => {
                    router.push("/dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    router.push("/products");
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  Products
                </button>

                <button
                  onClick={() => {
                    router.push("/suppliers");
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  Suppliers
                </button>

                <button
                  onClick={handleLogout}
                  className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </nav>
            )}
          </header>

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}