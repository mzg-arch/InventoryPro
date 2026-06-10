"use client";

import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <aside className="min-h-screen w-64 border-r bg-white p-6">
      <h1 className="text-2xl font-bold">InventoryPro</h1>
      <p className="mt-1 text-sm text-slate-500">Inventory dashboard</p>

      <nav className="mt-8 space-y-2">
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100"
        >
          Dashboard
        </button>

        <button
          onClick={() => router.push("/products")}
          className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100"
        >
          Products
        </button>

        <button
          onClick={() => router.push("/suppliers")}
          className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100"
        >
          Suppliers
        </button>

        <button
          onClick={handleLogout}
          className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}