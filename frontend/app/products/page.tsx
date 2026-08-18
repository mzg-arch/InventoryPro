"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Boxes, ListFilter, Plus, Search } from "lucide-react";
import api from "../../lib/api";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/layout/PageHeader";
import MetricCard from "../../components/ui/metric-card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  minStock: number;
  description?: string;
  createdAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("Loading products...");
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await api.get("/products");
        setProducts(response.data.products);
        setMessage("");
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      }
    }

    fetchProducts();
  }, [router]);

  async function handleDeleteProduct(id: string) {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id),
      );
    } catch {
      alert("Failed to delete product.");
    }
  }

  const filteredProducts = products.filter((product) => {
    const searchText = searchTerm.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.sku.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText);
    const isLowStock = product.quantity <= product.minStock;
    const matchesStockFilter =
      stockFilter === "all" ||
      (stockFilter === "low" && isLowStock) ||
      (stockFilter === "in-stock" && !isLowStock);

    return matchesSearch && matchesStockFilter;
  });

  const lowStockCount = products.filter(
    (product) => product.quantity <= product.minStock,
  ).length;

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1440px]">
        <PageHeader
          eyebrow="Inventory management"
          title="Products"
          description="Manage product records, quantities, pricing, and minimum stock levels."
          actions={
            <Button
              onClick={() => router.push("/products/create")}
              className="w-full sm:w-auto"
            >
              <Plus aria-hidden="true" />
              Add product
            </Button>
          }
        />

        {message ? (
          <p className="status-message mt-5">{message}</p>
        ) : (
          <>
            <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
              <MetricCard
                label="Total products"
                value={products.length}
                description="Catalog records"
                icon={<Boxes className="size-3.5" aria-hidden="true" />}
              />
              <MetricCard
                label="Low stock"
                value={lowStockCount}
                description="Needs attention"
                icon={<AlertTriangle className="size-3.5" aria-hidden="true" />}
                alert={lowStockCount > 0}
              />
              <div className="col-span-2 lg:col-span-1">
                <MetricCard
                  label="Showing"
                  value={filteredProducts.length}
                  description={`of ${products.length} products`}
                  icon={<ListFilter className="size-3.5" aria-hidden="true" />}
                />
              </div>
            </section>

            <section className="mt-4 rounded-lg border border-border bg-surface-primary p-3 shadow-xs">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1 sm:max-w-md">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-text-muted"
                    aria-hidden="true"
                  />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name, SKU, or category"
                    aria-label="Search products"
                    className="pl-9"
                  />
                </div>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  aria-label="Filter by stock status"
                  className="h-9 rounded-md border border-border-strong bg-surface-primary px-3 text-sm text-text-secondary shadow-xs outline-none hover:border-subtle-accent focus-visible:border-button-hover focus-visible:ring-2 focus-visible:ring-subtle-accent/10 sm:w-40"
                >
                  <option value="all">All stock</option>
                  <option value="in-stock">In stock</option>
                  <option value="low">Low stock</option>
                </select>
              </div>
            </section>

            <section className="mt-4 grid gap-3 md:hidden" aria-label="Products">
              {filteredProducts.length === 0 && (
                <div className="rounded-lg border border-border bg-surface-primary px-5 py-10 text-center shadow-xs">
                  <p className="text-sm font-medium text-text-primary">No products found</p>
                  <p className="mt-1 text-xs text-text-muted">
                    Adjust your search or stock filter.
                  </p>
                </div>
              )}

              {filteredProducts.map((product) => {
                const isLowStock = product.quantity <= product.minStock;

                return (
                  <article
                    key={product.id}
                    className="rounded-lg border border-border bg-surface-primary p-4 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold text-text-primary">
                          {product.name}
                        </h2>
                        <p className="mt-0.5 text-xs text-text-muted">
                          {product.sku} · {product.category}
                        </p>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                          isLowStock
                            ? "border-subtle-accent/40 bg-subtle-accent/10 text-button-primary"
                            : "border-border bg-surface-secondary text-text-secondary"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${isLowStock ? "bg-subtle-accent" : "bg-surface-secondary0"}`}
                        />
                        {isLowStock ? "Low stock" : "In stock"}
                      </span>
                    </div>

                    <dl className="mt-4 grid grid-cols-3 divide-x divide-border border-y border-border py-3">
                      <div className="pr-3">
                        <dt className="text-[10px] text-text-muted">Quantity</dt>
                        <dd className="mt-1 text-xs font-semibold tabular-nums text-text-primary">
                          {product.quantity}
                        </dd>
                      </div>
                      <div className="px-3">
                        <dt className="text-[10px] text-text-muted">Minimum</dt>
                        <dd className="mt-1 text-xs font-semibold tabular-nums text-text-primary">
                          {product.minStock}
                        </dd>
                      </div>
                      <div className="pl-3">
                        <dt className="text-[10px] text-text-muted">Price</dt>
                        <dd className="mt-1 text-xs font-semibold tabular-nums text-text-primary">
                          {product.price.toLocaleString()} ETB
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/products/${product.id}/edit`)}
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1"
                      >
                        Delete
                      </Button>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="mt-4 hidden overflow-hidden rounded-lg border border-border bg-surface-primary shadow-xs md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                  <thead className="border-b border-border bg-surface-secondary text-xs text-text-muted">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Product</th>
                      <th className="px-4 py-2.5 font-medium">Category</th>
                      <th className="px-4 py-2.5 text-right font-medium">Quantity</th>
                      <th className="px-4 py-2.5 text-right font-medium">Price</th>
                      <th className="px-4 py-2.5 font-medium">Status</th>
                      <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-sm text-text-muted">
                          No products match your search or filter.
                        </td>
                      </tr>
                    )}
                    {filteredProducts.map((product) => {
                      const isLowStock = product.quantity <= product.minStock;

                      return (
                        <tr
                          key={product.id}
                          className="border-t border-border transition-colors duration-150 hover:bg-surface-secondary"
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-text-primary">{product.name}</p>
                            <p className="mt-0.5 text-xs text-text-muted">{product.sku}</p>
                          </td>
                          <td className="px-4 py-3 text-text-secondary">{product.category}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-text-secondary">
                            {product.quantity}
                          </td>
                          <td className="px-4 py-3 text-right font-medium tabular-nums text-text-primary">
                            {product.price.toLocaleString()} ETB
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                                isLowStock
                                  ? "border-subtle-accent/40 bg-subtle-accent/10 text-button-primary"
                                  : "border-border bg-surface-secondary text-text-secondary"
                              }`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${isLowStock ? "bg-subtle-accent" : "bg-surface-secondary0"}`}
                              />
                              {isLowStock ? "Low stock" : "In stock"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/products/${product.id}/edit`)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}
