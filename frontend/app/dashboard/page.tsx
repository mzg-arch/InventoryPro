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
      <main className="p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="mt-2 text-slate-600">
                Overview of your inventory, suppliers, and stock value.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/products/create")}
                className="rounded-md bg-black px-4 py-2 text-sm text-white"
              >
                Add Product
              </button>

              <button
                onClick={() => router.push("/suppliers/create")}
                className="rounded-md border bg-white px-4 py-2 text-sm"
              >
                Add Supplier
              </button>
            </div>
          </div>

          {message && <p className="mt-6 text-sm text-slate-700">{message}</p>}

          {stats && (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-xl bg-white p-5 shadow">
                  <p className="text-sm text-slate-500">Total Products</p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {stats.totalProducts}
                  </h2>
                  <p className="mt-2 text-xs text-slate-500">
                    Products in your inventory
                  </p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow">
                  <p className="text-sm text-slate-500">Total Suppliers</p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {stats.totalSuppliers}
                  </h2>
                  <p className="mt-2 text-xs text-slate-500">
                    Active supplier records
                  </p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow">
                  <p className="text-sm text-slate-500">Low Stock</p>
                  <h2 className="mt-2 text-3xl font-bold text-red-600">
                    {stats.lowStockProducts}
                  </h2>
                  <p className="mt-2 text-xs text-slate-500">
                    Products needing restock
                  </p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow">
                  <p className="text-sm text-slate-500">Inventory Value</p>
                  <h2 className="mt-2 text-2xl font-bold">
                    {stats.totalInventoryValue.toLocaleString()} ETB
                  </h2>
                  <p className="mt-2 text-xs text-slate-500">
                    Quantity × product price
                  </p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow">
                  <p className="text-sm text-slate-500">Stock Quantity</p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {stats.totalStockQuantity}
                  </h2>
                  <p className="mt-2 text-xs text-slate-500">
                    Total units available
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl bg-white p-6 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Low Stock Products</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Products where quantity is at or below minimum stock.
                      </p>
                    </div>

                    <button
                      onClick={() => router.push("/products")}
                      className="rounded-md border px-3 py-2 text-sm"
                    >
                      View All
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {lowStockProducts.length === 0 && (
                      <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                        No low-stock products right now.
                      </p>
                    )}

                    {lowStockProducts.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            SKU: {product.sku} • {product.category}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-red-600">
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

                <div className="rounded-xl bg-white p-6 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Recent Products</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Latest products added to your inventory.
                      </p>
                    </div>

                    <button
                      onClick={() => router.push("/products/create")}
                      className="rounded-md bg-black px-3 py-2 text-sm text-white"
                    >
                      Add New
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {recentProducts.length === 0 && (
                      <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                        No products yet. Add your first product to get started.
                      </p>
                    )}

                    {recentProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {product.category} • SKU: {product.sku}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold">
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
              </div>
            </>
          )}
        </div>
      </main>
    </AppLayout>
  );
}