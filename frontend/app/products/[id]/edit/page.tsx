"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import api from "../../../../lib/api";
import AppLayout from "../../../../components/layout/AppLayout";
import PageHeader from "../../../../components/layout/PageHeader";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [minStock, setMinStock] = useState("");
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

  async function handleUpdateProduct(e: FormEvent) {
    e.preventDefault();

    try {
      setMessage("Updating product...");
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
      setMessage("Failed to update product. Please check your inputs.");
    }
  }

  const isLoading = message === "Loading product...";
  const isSubmitting = message === "Updating product...";

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        <PageHeader
          eyebrow="Product management"
          title="Edit product"
          description="Update this product's details, quantity, pricing, and stock threshold."
          actions={
            <Button variant="outline" onClick={() => router.push("/products")}>
              <ChevronLeft aria-hidden="true" />
              Back to products
            </Button>
          }
        />

        <section className="mt-5 rounded-lg border border-border bg-surface-primary shadow-xs">
          {isLoading ? (
            <p className="status-message m-4 sm:m-5">{message}</p>
          ) : (
            <form onSubmit={handleUpdateProduct}>
              <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Product name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required type="number" min="0" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price (ETB)</Label>
                  <Input id="price" value={price} onChange={(e) => setPrice(e.target.value)} required type="number" min="0" step="0.01" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="minStock">Minimum stock</Label>
                  <Input id="minStock" value={minStock} onChange={(e) => setMinStock(e.target.value)} required type="number" min="0" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Optional product notes"
                    className="field-control resize-y"
                  />
                </div>

                {message && (
                  <p className="status-message md:col-span-2" role="status" aria-live="polite">
                    {message}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-border bg-surface-secondary px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
                <Button type="button" variant="outline" onClick={() => router.push("/products")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving changes..." : "Save changes"}
                </Button>
              </div>
            </form>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
