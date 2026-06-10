"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../lib/api";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const productId = params.id as string;

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [price, setPrice] = useState("0");
  const [minStock, setMinStock] = useState("5");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("Loading product...");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await api.get(`/products/${productId}`);
        const product = response.data.product;

        setName(product.name);
        setSku(product.sku);
        setCategory(product.category);
        setQuantity(String(product.quantity));
        setPrice(String(product.price));
        setMinStock(String(product.minStock));
        setDescription(product.description || "");
        setMessage("");
      } catch {
        setMessage("Failed to load product.");
      }
    }

    fetchProduct();
  }, [productId, router]);

  async function handleUpdateProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await api.patch(`/products/${productId}`, {
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
      setMessage("Failed to update product. Check the fields and try again.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="mt-2 text-slate-600">
            Update product information and stock details.
          </p>
        </div>

        {message === "Loading product..." && (
          <p className="mt-6 text-sm text-slate-700">{message}</p>
        )}

        {message !== "Loading product..." && message && (
          <p className="mt-6 text-sm text-red-600">{message}</p>
        )}

        {!message && (
          <form
            onSubmit={handleUpdateProduct}
            className="mt-8 space-y-4 rounded-xl bg-white p-6 shadow"
          >
            <div>
              <label className="text-sm font-medium">Product Name</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">SKU</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <input
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  type="number"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Price</label>
                <input
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Minimum Stock</label>
                <input
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                  type="number"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-md bg-black px-4 py-2 text-white"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => router.push("/products")}
                className="rounded-md border px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}