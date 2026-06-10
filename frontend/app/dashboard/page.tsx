"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import AppLayout from "../../components/layout/AppLayout";

interface DashboardStats {
  totalProducts: number;
  totalSuppliers: number;
  lowStockProducts: number;
  totalInventoryValue: number;
  totalStockQuantity: number;
}

export default function DashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [message, setMessage] = useState("Loading dashboard...");

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await api.get("/dashboard/stats");

        setStats(response.data.stats);
        setMessage("");
      } catch {
        localStorage.removeItem("token");
        router.push("/login");
      }
    }

    fetchStats();
  }, [router]);

  return (
    <AppLayout>
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold">InventoryPro Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Overview of your products, suppliers, and stock value.
          </p>
        </div>

        {message && <p className="mt-6 text-sm text-slate-700">{message}</p>}

        {stats && (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-slate-500">Total Products</p>
              <h2 className="mt-2 text-3xl font-bold">{stats.totalProducts}</h2>
            </div>

            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-slate-500">Total Suppliers</p>
              <h2 className="mt-2 text-3xl font-bold">{stats.totalSuppliers}</h2>
            </div>

            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-slate-500">Low Stock</p>
              <h2 className="mt-2 text-3xl font-bold">
                {stats.lowStockProducts}
              </h2>
            </div>

            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-slate-500">Inventory Value</p>
              <h2 className="mt-2 text-2xl font-bold">
                {stats.totalInventoryValue.toLocaleString()} ETB
              </h2>
            </div>

            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-slate-500">Stock Quantity</p>
              <h2 className="mt-2 text-3xl font-bold">
                {stats.totalStockQuantity}
              </h2>
            </div>
          </div>
        )}
      </div>
    </main>
  </AppLayout>
  );
}