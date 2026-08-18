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

export default function CreateSupplierPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  async function handleCreateSupplier(e: FormEvent) {
    e.preventDefault();

    try {
      setMessage("Creating supplier...");
      await api.post("/suppliers", { name, email, phone, address });
      router.push("/suppliers");
    } catch {
      setMessage("Failed to create supplier. Please check your inputs.");
    }
  }

  const isSubmitting = message === "Creating supplier...";

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        <PageHeader
          eyebrow="Supplier management"
          title="Add supplier"
          description="Create a supplier contact record for inventory sourcing."
          actions={
            <Button variant="outline" onClick={() => router.push("/suppliers")}>
              <ChevronLeft aria-hidden="true" />
              Back to suppliers
            </Button>
          }
        />

        <section className="mt-5 rounded-lg border border-border bg-surface-primary shadow-xs">
          <form onSubmit={handleCreateSupplier}>
            <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Supplier name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Addis Tech Supplies" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="supplier@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+251 911 123 456" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Addis Ababa, Ethiopia" />
              </div>

              {message && (
                <p className="status-message md:col-span-2" role="status" aria-live="polite">
                  {message}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border bg-surface-secondary px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
              <Button type="button" variant="outline" onClick={() => router.push("/suppliers")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating supplier..." : "Create supplier"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </AppLayout>
  );
}
