"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoggedInUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Sidebar() {
  const router = useRouter();

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

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r bg-white p-6">
      <div>
        <h1 className="text-2xl font-bold">InventoryPro</h1>
        <p className="mt-1 text-sm text-slate-500">Inventory dashboard</p>
      </div>

      {user && (
        <div className="mt-6 rounded-xl bg-slate-100 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="mt-3">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="mt-1 break-all text-xs text-slate-500">
              {user.email}
            </p>
            <p className="mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-700">
              {user.role}
            </p>
          </div>
        </div>
      )}

      <nav className="mt-8 flex-1 space-y-2">
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
      </nav>

      <button
        onClick={handleLogout}
        className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
      >
        Logout
      </button>
    </aside>
  );
}