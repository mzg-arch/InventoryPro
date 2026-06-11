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

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  minStock: number;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("Loading dashboard...");

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const statsResponse = await api.get("/dashboard/stats");
        const productsResponse = await api.get("/products");

        setStats(statsResponse.data.stats);
        setProducts(productsResponse.data.products);
        setMessage("");
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      }
    }

    fetchDashboardData();
  }, [router]);

  const lowStockProducts = products.filter((product) => {
    return product.quantity <= product.minStock;
  });

  const recentProducts = products.slice(0, 5);

  return (
    <AppLayout>
      <main>
        <div className="mx-auto max-w-7xl">
          <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-8 text-white shadow-2xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-200">
                  Inventory Overview
                </p>

                <h1 className="mt-2 text-4xl font-black tracking-tight">
                  Dashboard
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Track your products, suppliers, stock levels, and total
                  inventory value from one clean workspace.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push("/products/create")}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-500"
                >
                  Add Product
                </button>

                <button
                  onClick={() => router.push("/suppliers/create")}
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                >
                  Add Supplier
                </button>
              </div>
            </div>
          </section>

          {message && (
            <p className="mt-6 rounded-2xl bg-white/80 p-5 text-sm text-slate-700 shadow">
              {message}
            </p>
          )}

          {stats && (
            <>
              <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                  <p className="text-sm font-medium text-slate-500">
                    Total Products
                  </p>
                  <h2 className="mt-3 text-4xl font-black text-slate-950">
                    {stats.totalProducts}
                  </h2>
                  <p className="mt-3 text-xs text-slate-500">
                    Products in your inventory
                  </p>
                </div>

                <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                  <p className="text-sm font-medium text-slate-500">
                    Total Suppliers
                  </p>
                  <h2 className="mt-3 text-4xl font-black text-slate-950">
                    {stats.totalSuppliers}
                  </h2>
                  <p className="mt-3 text-xs text-slate-500">
                    Supplier contact records
                  </p>
                </div>

                <div className="rounded-3xl border border-red-100 bg-white/85 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                  <p className="text-sm font-medium text-slate-500">
                    Low Stock
                  </p>
                  <h2 className="mt-3 text-4xl font-black text-red-600">
                    {stats.lowStockProducts}
                  </h2>
                  <p className="mt-3 text-xs text-slate-500">
                    Products needing restock
                  </p>
                </div>

                <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl xl:col-span-1">
                  <p className="text-sm font-medium text-slate-500">
                    Inventory Value
                  </p>
                  <h2 className="mt-3 text-2xl font-black text-slate-950">
                    {stats.totalInventoryValue.toLocaleString()} ETB
                  </h2>
                  <p className="mt-3 text-xs text-slate-500">
                    Quantity multiplied by price
                  </p>
                </div>

                <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                  <p className="text-sm font-medium text-slate-500">
                    Stock Quantity
                  </p>
                  <h2 className="mt-3 text-4xl font-black text-slate-950">
                    {stats.totalStockQuantity}
                  </h2>
                  <p className="mt-3 text-xs text-slate-500">
                    Total available units
                  </p>
                </div>
              </section>

              <section className="mt-6 grid gap-6 xl:grid-cols-2">
                <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-slate-950">
                        Low Stock Products
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Products at or below minimum stock.
                      </p>
                    </div>

                    <button
                      onClick={() => router.push("/products")}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 hover:shadow"
                    >
                      View All
                    </button>
                  </div>

                  <div className="mt-6 space-y-3">
                    {lowStockProducts.length === 0 && (
                      <p className="rounded-2xl border border-green-100 bg-green-50 p-5 text-sm font-medium text-green-700">
                        No low-stock products right now. Your inventory looks
                        healthy.
                      </p>
                    )}

                    {lowStockProducts.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-lg"
                      >
                        <div>
                          <p className="font-bold text-slate-900">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            SKU: {product.sku} • {product.category}
                          </p>
                        </div>

                        <div className="rounded-xl bg-red-50 px-4 py-2 text-right">
                          <p className="text-sm font-black text-red-600">
                            {product.quantity} left
                          </p>
                          <p className="text-xs text-slate-500">
                            Min: {product.minStock}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-slate-950">
                        Recent Products
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Latest products added to inventory.
                      </p>
                    </div>

                    <button
                      onClick={() => router.push("/products/create")}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-blue-500"
                    >
                      Add New
                    </button>
                  </div>

                  <div className="mt-6 space-y-3">
                    {recentProducts.length === 0 && (
                      <p className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-600">
                        No products yet. Add your first product to get started.
                      </p>
                    )}

                    {recentProducts.map((product) => (
                      <div
                        key={product.id}
                        className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
                      >
                        <div>
                          <p className="font-bold text-slate-900">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {product.category} • SKU: {product.sku}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-black text-slate-900">
                            {product.price.toLocaleString()} ETB
                          </p>
                          <p className="text-xs text-slate-500">
                            Qty: {product.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </AppLayout>
  );
}