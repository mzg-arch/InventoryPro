"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import AppLayout from "../../../components/layout/AppLayout";

export default function CreateProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [minStock, setMinStock] = useState("5");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function handleCreateProduct(e: FormEvent) {
    e.preventDefault();

    try {
      setMessage("Creating product...");

      await api.post("/products", {
        name,
        sku,
        category,
        quantity: Number(quantity),
        price: Number(price),
        minStock: Number(minStock),
        description,
      });

      router.push("/products");
    } catch {
      setMessage("Failed to create product. Please check your inputs.");
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-6 text-white shadow-2xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-200">
                Product Management
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                Add Product
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Add a new inventory item with stock quantity, pricing, category,
                and minimum stock level.
              </p>
            </div>

            <button
              onClick={() => router.push("/products")}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 md:w-auto"
            >
              Back to Products
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur md:p-8">
          <form onSubmit={handleCreateProduct} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Product Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Example: Wireless Mouse"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  SKU
                </label>
                <input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  required
                  placeholder="Example: WM-001"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Category
                </label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  placeholder="Example: Electronics"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Quantity
                </label>
                <input
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  type="number"
                  min="0"
                  placeholder="Example: 25"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Price
                </label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Example: 1500"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Minimum Stock
                </label>
                <input
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                  required
                  type="number"
                  min="0"
                  placeholder="Example: 5"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional product notes..."
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {message && (
              <p className="rounded-2xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
                {message}
              </p>
            )}

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 hover:shadow"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                Create Product
              </button>
            </div>
          </form>
        </section>
      </div>
    </AppLayout>
  );
}