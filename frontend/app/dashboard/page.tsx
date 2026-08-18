"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  PackagePlus,
  Plus,
  Truck,
} from "lucide-react";
import api from "../../lib/api";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/layout/PageHeader";
import MetricCard from "../../components/ui/metric-card";
import { Button } from "../../components/ui/button";

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

  const lowStockProducts = products.filter(
    (product) => product.quantity <= product.minStock,
  );
  const recentProducts = products.slice(0, 5);
  const healthyProductCount = products.length - lowStockProducts.length;
  const healthyStockPercent = products.length
    ? Math.round((healthyProductCount / products.length) * 100)
    : 0;

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1440px]">
        <PageHeader
          eyebrow="Inventory overview"
          title="Dashboard"
          description="Review stock levels, inventory value, and the records that need attention."
          actions={
            <>
              <Button
                variant="outline"
                onClick={() => router.push("/suppliers/create")}
                className="flex-1 sm:flex-none"
              >
                <Truck aria-hidden="true" />
                Add supplier
              </Button>
              <Button
                onClick={() => router.push("/products/create")}
                className="flex-1 sm:flex-none"
              >
                <Plus aria-hidden="true" />
                Add product
              </Button>
            </>
          }
        />

        {message && <p className="status-message mt-5">{message}</p>}

        {stats && (
          <>
            <section
              className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5"
              aria-label="Inventory statistics"
            >
              <MetricCard
                label="Products"
                value={stats.totalProducts}
                description="Catalog records"
                icon={<Boxes className="size-3.5" aria-hidden="true" />}
              />
              <MetricCard
                label="Suppliers"
                value={stats.totalSuppliers}
                description="Contact records"
                icon={<Truck className="size-3.5" aria-hidden="true" />}
              />
              <MetricCard
                label="Low stock"
                value={stats.lowStockProducts}
                description="At or below minimum"
                icon={<AlertTriangle className="size-3.5" aria-hidden="true" />}
                alert={stats.lowStockProducts > 0}
              />
              <MetricCard
                label="Inventory value"
                value={`${stats.totalInventoryValue.toLocaleString()} ETB`}
                description="Quantity × unit price"
                icon={
                  <CircleDollarSign className="size-3.5" aria-hidden="true" />
                }
              />
              <div className="col-span-2 lg:col-span-1">
                <MetricCard
                  label="Stock units"
                  value={stats.totalStockQuantity.toLocaleString()}
                  description="Available quantity"
                  icon={<PackagePlus className="size-3.5" aria-hidden="true" />}
                />
              </div>
            </section>

            <section className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)]">
              <div className="overflow-hidden rounded-lg border border-border bg-surface-primary shadow-xs">
                <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-text-primary">
                      Recently added products
                    </h2>
                    <p className="mt-0.5 text-xs text-text-muted">
                      The latest inventory records available in your catalog.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/products")}
                    className="self-start sm:self-auto"
                  >
                    View all products
                  </Button>
                </div>

                {recentProducts.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <Boxes className="mx-auto size-5 text-text-muted" aria-hidden="true" />
                    <p className="mt-3 text-sm font-medium text-text-primary">
                      No products yet
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      Add your first product to begin tracking stock.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => router.push("/products/create")}
                      className="mt-4"
                    >
                      Add product
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left text-sm">
                      <thead className="bg-surface-secondary text-xs text-text-muted">
                        <tr>
                          <th className="px-4 py-2.5 font-medium">Product</th>
                          <th className="px-4 py-2.5 font-medium">Category</th>
                          <th className="px-4 py-2.5 text-right font-medium">
                            Quantity
                          </th>
                          <th className="px-4 py-2.5 text-right font-medium">
                            Unit price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentProducts.map((product) => (
                          <tr
                            key={product.id}
                            className="border-t border-border transition-colors duration-150 hover:bg-surface-secondary"
                          >
                            <td className="px-4 py-3">
                              <button
                                onClick={() =>
                                  router.push(`/products/${product.id}/edit`)
                                }
                                className="rounded-sm text-left font-medium text-text-primary outline-none hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-subtle-accent/20"
                              >
                                {product.name}
                              </button>
                              <p className="mt-0.5 text-xs text-text-muted">
                                {product.sku}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-text-secondary">
                              {product.category}
                            </td>
                            <td className="px-4 py-3 text-right tabular-nums text-text-secondary">
                              {product.quantity}
                            </td>
                            <td className="px-4 py-3 text-right font-medium tabular-nums text-text-primary">
                              {product.price.toLocaleString()} ETB
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-lg border border-border bg-surface-raised p-4 shadow-xs">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-sm font-semibold text-text-primary">
                        Stock overview
                      </h2>
                      <p className="mt-0.5 text-xs text-text-muted">
                        Product lines above their minimum level.
                      </p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums text-text-primary">
                      {healthyStockPercent}%
                    </p>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-button-primary"
                      style={{ width: `${healthyStockPercent}%` }}
                    />
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3">
                    <div>
                      <dt className="text-[11px] text-text-muted">Above minimum</dt>
                      <dd className="mt-1 text-sm font-semibold tabular-nums text-text-primary">
                        {healthyProductCount}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-text-muted">Needs attention</dt>
                      <dd className="mt-1 text-sm font-semibold tabular-nums text-text-primary">
                        {lowStockProducts.length}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-lg border border-border bg-surface-primary p-4 shadow-xs">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-sm font-semibold text-text-primary">
                        Supplier summary
                      </h2>
                      <p className="mt-0.5 text-xs text-text-muted">
                        Contacts available for inventory sourcing.
                      </p>
                    </div>
                    <Truck className="size-4 text-text-muted" aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-xl font-semibold tabular-nums text-text-primary">
                    {stats.totalSuppliers}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/suppliers")}
                    className="mt-3 w-full"
                  >
                    View suppliers
                  </Button>
                </div>
              </div>
            </section>

            <section className="mt-4 overflow-hidden rounded-lg border border-border bg-surface-primary shadow-xs">
              <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
                <div>
                  <h2 className="text-sm font-semibold text-text-primary">
                    Low-stock items
                  </h2>
                  <p className="mt-0.5 text-xs text-text-muted">
                    Products at or below their configured minimum.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/products")}
                >
                  Review inventory
                </Button>
              </div>

              {lowStockProducts.length === 0 ? (
                <div className="px-4 py-7 text-center text-xs text-text-muted">
                  No products currently require restocking.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3">
                  {lowStockProducts.slice(0, 6).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => router.push(`/products/${product.id}/edit`)}
                      className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 text-left outline-none last:border-b-0 hover:bg-surface-secondary focus-visible:bg-neutral-hover focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-subtle-accent/20 sm:odd:border-r xl:border-r xl:[&:nth-child(3n)]:border-r-0"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-text-primary">
                          {product.name}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-text-muted">
                          {product.sku} · {product.category}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-sm font-semibold tabular-nums text-button-primary">
                          {product.quantity} left
                        </span>
                        <span className="block text-[11px] text-text-muted">
                          Min. {product.minStock}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}
