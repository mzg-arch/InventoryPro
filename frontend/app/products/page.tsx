"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

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

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="mt-2 text-slate-600">
              Manage your inventory products and stock levels.
            </p>
          </div>

          <button
            onClick={() => router.push("/products/create")}
            className="rounded-md bg-black px-4 py-2 text-white"
            >
            Add Product
            </button>
        </div>

        {message && <p className="mt-6 text-sm text-slate-700">{message}</p>}

        {!message && (
          <div className="mt-8 overflow-hidden rounded-xl bg-white shadow">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-sm font-semibold">SKU</th>
                  <th className="px-4 py-3 text-sm font-semibold">Category</th>
                  <th className="px-4 py-3 text-sm font-semibold">Quantity</th>
                  <th className="px-4 py-3 text-sm font-semibold">Price</th>
                  <th className="px-4 py-3 text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-sm font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-sm text-slate-500"
                    >
                      No products found.
                    </td>
                  </tr>
                )}

                {products.map((product) => {
                  const isLowStock = product.quantity <= product.minStock;

                  return (
                    <tr key={product.id} className="border-t">
                      <td className="px-4 py-3 text-sm font-medium">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {product.sku}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {product.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {product.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {product.price.toLocaleString()} ETB
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {isLowStock ? (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            Low Stock
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/products/${product.id}/edit`)}
                            className="rounded-md border px-3 py-1 text-sm"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="rounded-md bg-red-600 px-3 py-1 text-sm text-white"
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
          </div>
        )}
      </div>
    </main>
  );
}