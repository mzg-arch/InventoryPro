"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, Plus, Search, Truck, Unlink } from "lucide-react";
import api from "../../lib/api";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/layout/PageHeader";
import MetricCard from "../../components/ui/metric-card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface SupplierProduct {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  products: SupplierProduct[];
  createdAt: string;
}

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [message, setMessage] = useState("Loading suppliers...");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await api.get("/suppliers");
        setSuppliers(response.data.suppliers);
        setMessage("");
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      }
    }

    fetchSuppliers();
  }, [router]);

  async function handleDeleteSupplier(id: string) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this supplier?",
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/suppliers/${id}`);
      setSuppliers((currentSuppliers) =>
        currentSuppliers.filter((supplier) => supplier.id !== id),
      );
    } catch {
      alert("Failed to delete supplier. Make sure no products are linked to it.");
    }
  }

  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchText = searchTerm.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(searchText) ||
      (supplier.email?.toLowerCase() || "").includes(searchText) ||
      (supplier.phone?.toLowerCase() || "").includes(searchText) ||
      (supplier.address?.toLowerCase() || "").includes(searchText)
    );
  });

  const suppliersWithProducts = suppliers.filter(
    (supplier) => supplier.products.length > 0,
  ).length;
  const suppliersWithoutProducts = suppliers.filter(
    (supplier) => supplier.products.length === 0,
  ).length;

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1440px]">
        <PageHeader
          eyebrow="Supplier management"
          title="Suppliers"
          description="Maintain supplier contact records and review their linked products."
          actions={
            <Button
              onClick={() => router.push("/suppliers/create")}
              className="w-full sm:w-auto"
            >
              <Plus aria-hidden="true" />
              Add supplier
            </Button>
          }
        />

        {message ? (
          <p className="status-message mt-5">{message}</p>
        ) : (
          <>
            <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
              <MetricCard
                label="Total suppliers"
                value={suppliers.length}
                description="Contact records"
                icon={<Truck className="size-3.5" aria-hidden="true" />}
              />
              <MetricCard
                label="Linked suppliers"
                value={suppliersWithProducts}
                description="With product records"
                icon={<Link2 className="size-3.5" aria-hidden="true" />}
              />
              <div className="col-span-2 lg:col-span-1">
                <MetricCard
                  label="Unlinked suppliers"
                  value={suppliersWithoutProducts}
                  description="Without products"
                  icon={<Unlink className="size-3.5" aria-hidden="true" />}
                />
              </div>
            </section>

            <section className="mt-4 rounded-lg border border-border bg-surface-primary p-3 shadow-xs">
              <div className="relative max-w-md">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-text-muted"
                  aria-hidden="true"
                />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name, email, phone, or address"
                  aria-label="Search suppliers"
                  className="pl-9"
                />
              </div>
            </section>

            <section className="mt-4 grid gap-3 md:hidden" aria-label="Suppliers">
              {filteredSuppliers.length === 0 && (
                <div className="rounded-lg border border-border bg-surface-primary px-5 py-10 text-center shadow-xs">
                  <p className="text-sm font-medium text-text-primary">No suppliers found</p>
                  <p className="mt-1 text-xs text-text-muted">Adjust your search term.</p>
                </div>
              )}

              {filteredSuppliers.map((supplier) => (
                <article
                  key={supplier.id}
                  className="rounded-lg border border-border bg-surface-primary p-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-semibold text-text-primary">
                        {supplier.name}
                      </h2>
                      <p className="mt-0.5 truncate text-xs text-text-muted">
                        {supplier.email || "No email provided"}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-border bg-surface-secondary px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                      {supplier.products.length > 0
                        ? `${supplier.products.length} linked`
                        : "Unlinked"}
                    </span>
                  </div>

                  <dl className="mt-4 space-y-2 border-y border-border py-3 text-xs">
                    <div className="grid grid-cols-[70px_1fr] gap-3">
                      <dt className="text-text-muted">Phone</dt>
                      <dd className="break-words text-text-primary">
                        {supplier.phone || "Not provided"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-[70px_1fr] gap-3">
                      <dt className="text-text-muted">Address</dt>
                      <dd className="break-words text-text-primary">
                        {supplier.address || "Not provided"}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/suppliers/${supplier.id}/edit`)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteSupplier(supplier.id)}
                      className="flex-1"
                    >
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </section>

            <section className="mt-4 hidden overflow-hidden rounded-lg border border-border bg-surface-primary shadow-xs md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                  <thead className="border-b border-border bg-surface-secondary text-xs text-text-muted">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Supplier</th>
                      <th className="px-4 py-2.5 font-medium">Phone</th>
                      <th className="px-4 py-2.5 font-medium">Address</th>
                      <th className="px-4 py-2.5 font-medium">Products</th>
                      <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-sm text-text-muted">
                          No suppliers match your search.
                        </td>
                      </tr>
                    )}
                    {filteredSuppliers.map((supplier) => (
                      <tr
                        key={supplier.id}
                        className="border-t border-border transition-colors duration-150 hover:bg-surface-secondary"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-text-primary">{supplier.name}</p>
                          <p className="mt-0.5 text-xs text-text-muted">
                            {supplier.email || "No email"}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {supplier.phone || "Not provided"}
                        </td>
                        <td className="max-w-xs px-4 py-3 text-text-secondary">
                          <p className="truncate">{supplier.address || "Not provided"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full border border-border bg-surface-secondary px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                            {supplier.products.length > 0
                              ? `${supplier.products.length} linked`
                              : "Unlinked"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/suppliers/${supplier.id}/edit`)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteSupplier(supplier.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
