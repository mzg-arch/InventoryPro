"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import api from "../../../lib/api";
import AppLayout from "../../../components/layout/AppLayout";
import PageHeader from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

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

  const isSubmitting = message === "Creating product...";

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        <PageHeader
          eyebrow="Product management"
          title="Add product"
          description="Create a product record with pricing, quantity, and a minimum stock level."
          actions={
            <Button variant="outline" onClick={() => router.push("/products")}>
              <ChevronLeft aria-hidden="true" />
              Back to products
            </Button>
          }
        />

        <section className="mt-5 rounded-lg border border-border bg-surface-primary shadow-xs">
          <form onSubmit={handleCreateProduct}>
            <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Product name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Wireless Mouse" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} required placeholder="WM-001" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="Electronics" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required type="number" min="0" placeholder="25" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (ETB)</Label>
                <Input id="price" value={price} onChange={(e) => setPrice(e.target.value)} required type="number" min="0" step="0.01" placeholder="1500" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="minStock">Minimum stock</Label>
                <Input id="minStock" value={minStock} onChange={(e) => setMinStock(e.target.value)} required type="number" min="0" placeholder="5" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional product notes"
                  rows={3}
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
                {isSubmitting ? "Creating product..." : "Create product"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </AppLayout>
  );
}
