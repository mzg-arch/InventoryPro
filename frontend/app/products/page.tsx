"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import AppLayout from "../../components/layout/AppLayout";

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

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id)
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

  const lowStockCount = products.filter((product) => {
    return product.quantity <= product.minStock;
  }).length;

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-6 text-white shadow-2xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-200">
                Inventory Management
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                Products
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Manage your products, track stock levels, monitor low inventory,
                and keep your product records organized.
              </p>
            </div>

            <button
              onClick={() => router.push("/products/create")}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-500 md:w-auto"
            >
              Add Product
            </button>
          </div>
        </section>

        {message && (
          <p className="mt-6 rounded-2xl bg-white/80 p-5 text-sm text-slate-700 shadow">
            {message}
          </p>
        )}

        {!message && (
          <>
            <section className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                <p className="text-sm font-medium text-slate-500">
                  Total Products
                </p>
                <h2 className="mt-3 text-4xl font-black text-slate-950">
                  {products.length}
                </h2>
                <p className="mt-3 text-xs text-slate-500">
                  Products saved in your account
                </p>
              </div>

              <div className="rounded-3xl border border-red-100 bg-white/85 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                <p className="text-sm font-medium text-slate-500">
                  Low Stock Products
                </p>
                <h2 className="mt-3 text-4xl font-black text-red-600">
                  {lowStockCount}
                </h2>
                <p className="mt-3 text-xs text-slate-500">
                  Products needing restock
                </p>
              </div>

              <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                <p className="text-sm font-medium text-slate-500">
                  Showing Results
                </p>
                <h2 className="mt-3 text-4xl font-black text-slate-950">
                  {filteredProducts.length}
                </h2>
                <p className="mt-3 text-xs text-slate-500">
                  Matching your search/filter
                </p>
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, SKU, or category..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 md:max-w-md"
                />

                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 md:w-auto"
                >
                  <option value="all">All Stock</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low">Low Stock</option>
                </select>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </section>

            {/* Mobile cards */}
            <section className="mt-5 grid gap-4 md:hidden">
              {filteredProducts.length === 0 && (
                <div className="rounded-3xl border border-white/60 bg-white/90 p-8 text-center text-sm text-slate-500 shadow-xl">
                  No products match your search or filter.
                </div>
              )}

              {filteredProducts.map((product) => {
                const isLowStock = product.quantity <= product.minStock;

                return (
                  <div
                    key={product.id}
                    className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-black text-slate-950">
                          {product.name}
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                          SKU: {product.sku}
                        </p>
                      </div>

                      {isLowStock ? (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                          Low
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          Stock
                        </span>
                      )}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Category</p>
                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {product.category}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Quantity</p>
                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {product.quantity}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Price</p>
                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {product.price.toLocaleString()} ETB
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Min Stock</p>
                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {product.minStock}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => router.push(`/products/${product.id}/edit`)}
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Desktop table */}
            <section className="mt-5 hidden overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-xl backdrop-blur md:block">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="px-5 py-4 text-sm font-semibold">Name</th>
                    <th className="px-5 py-4 text-sm font-semibold">SKU</th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Category
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Quantity
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">Price</th>
                    <th className="px-5 py-4 text-sm font-semibold">Status</th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        No products match your search or filter.
                      </td>
                    </tr>
                  )}

                  {filteredProducts.map((product) => {
                    const isLowStock = product.quantity <= product.minStock;

                    return (
                      <tr
                        key={product.id}
                        className="border-t border-slate-100 transition hover:bg-blue-50/60"
                      >
                        <td className="px-5 py-4 text-sm font-bold text-slate-950">
                          {product.name}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {product.sku}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {product.category}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {product.quantity}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                          {product.price.toLocaleString()} ETB
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {isLowStock ? (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                              Low Stock
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                              In Stock
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                router.push(`/products/${product.id}/edit`)
                              }
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 hover:shadow"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500 hover:shadow"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}