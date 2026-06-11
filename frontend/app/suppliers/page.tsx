"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import AppLayout from "../../components/layout/AppLayout";

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
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/suppliers/${id}`);

      setSuppliers((currentSuppliers) =>
        currentSuppliers.filter((supplier) => supplier.id !== id)
      );
    } catch {
      alert("Failed to delete supplier. Make sure no products are linked to it.");
    }
  }

  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchText = searchTerm.toLowerCase();

    const name = supplier.name.toLowerCase();
    const email = supplier.email?.toLowerCase() || "";
    const phone = supplier.phone?.toLowerCase() || "";
    const address = supplier.address?.toLowerCase() || "";

    return (
      name.includes(searchText) ||
      email.includes(searchText) ||
      phone.includes(searchText) ||
      address.includes(searchText)
    );
  });

  const suppliersWithProducts = suppliers.filter((supplier) => {
    return supplier.products.length > 0;
  }).length;

  const suppliersWithoutProducts = suppliers.filter((supplier) => {
    return supplier.products.length === 0;
  }).length;

  return (
    <AppLayout>
      <main className="p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Suppliers</h1>
              <p className="mt-2 text-slate-600">
                Manage product suppliers and contact information.
              </p>
            </div>

            <button
              onClick={() => router.push("/suppliers/create")}
              className="rounded-md bg-black px-4 py-2 text-sm text-white"
            >
              Add Supplier
            </button>
          </div>

          {message && <p className="mt-6 text-sm text-slate-700">{message}</p>}

          {!message && (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-white p-5 shadow">
                  <p className="text-sm text-slate-500">Total Suppliers</p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {suppliers.length}
                  </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow">
                  <p className="text-sm text-slate-500">Linked Suppliers</p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {suppliersWithProducts}
                  </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow">
                  <p className="text-sm text-slate-500">Unlinked Suppliers</p>
                  <h2 className="mt-2 text-3xl font-bold text-orange-600">
                    {suppliersWithoutProducts}
                  </h2>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-white p-4 shadow">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, phone, or address..."
                  className="w-full rounded-md border px-3 py-2 text-sm md:max-w-md"
                />
              </div>

              <p className="mt-3 text-sm text-slate-500">
                Showing {filteredSuppliers.length} of {suppliers.length} suppliers
              </p>

              <div className="mt-4 overflow-hidden rounded-xl bg-white shadow">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold">Name</th>
                      <th className="px-4 py-3 text-sm font-semibold">Email</th>
                      <th className="px-4 py-3 text-sm font-semibold">Phone</th>
                      <th className="px-4 py-3 text-sm font-semibold">
                        Address
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold">
                        Products
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSuppliers.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-10 text-center text-sm text-slate-500"
                        >
                          No suppliers match your search.
                        </td>
                      </tr>
                    )}

                    {filteredSuppliers.map((supplier) => (
                      <tr key={supplier.id} className="border-t">
                        <td className="px-4 py-3 text-sm font-medium">
                          {supplier.name}
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-600">
                          {supplier.email || "N/A"}
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-600">
                          {supplier.phone || "N/A"}
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-600">
                          {supplier.address || "N/A"}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          {supplier.products.length > 0 ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              {supplier.products.length} linked
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              None
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                router.push(`/suppliers/${supplier.id}/edit`)
                              }
                              className="rounded-md border px-3 py-1 text-sm"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteSupplier(supplier.id)}
                              className="rounded-md bg-red-600 px-3 py-1 text-sm text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </AppLayout>
  );
}