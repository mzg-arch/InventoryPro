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

export default function EditSupplierPage() {
  const router = useRouter();
  const params = useParams();
  const supplierId = params.id as string;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("Loading supplier...");

  useEffect(() => {
    async function fetchSupplier() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await api.get(`/suppliers/${supplierId}`);
        const supplier = response.data.supplier;
        setName(supplier.name);
        setEmail(supplier.email || "");
        setPhone(supplier.phone || "");
        setAddress(supplier.address || "");
        setMessage("");
      } catch {
        setMessage("Failed to load supplier.");
      }
    }

    fetchSupplier();
  }, [supplierId, router]);

  async function handleUpdateSupplier(e: FormEvent) {
    e.preventDefault();

    try {
      setMessage("Updating supplier...");
      await api.patch(`/suppliers/${supplierId}`, { name, email, phone, address });
      router.push("/suppliers");
    } catch {
      setMessage("Failed to update supplier. Please check your inputs.");
    }
  }

  const isLoading = message === "Loading supplier...";
  const isSubmitting = message === "Updating supplier...";

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        <PageHeader
          eyebrow="Supplier management"
          title="Edit supplier"
          description="Update this supplier's contact and address information."
          actions={
            <Button variant="outline" onClick={() => router.push("/suppliers")}>
              <ChevronLeft aria-hidden="true" />
              Back to suppliers
            </Button>
          }
        />

        <section className="mt-5 rounded-lg border border-border bg-surface-primary shadow-xs">
          {isLoading ? (
            <p className="status-message m-4 sm:m-5">{message}</p>
          ) : (
            <form onSubmit={handleUpdateSupplier}>
              <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Supplier name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
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
