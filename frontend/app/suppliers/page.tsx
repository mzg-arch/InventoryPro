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
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-6 text-white shadow-2xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-200">
                Supplier Management
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                Suppliers
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Manage supplier contacts, track linked products, and keep your
                inventory sourcing organized.
              </p>
            </div>

            <button
              onClick={() => router.push("/suppliers/create")}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-500 md:w-auto"
            >
              Add Supplier
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
                  Total Suppliers
                </p>
                <h2 className="mt-3 text-4xl font-black text-slate-950">
                  {suppliers.length}
                </h2>
                <p className="mt-3 text-xs text-slate-500">
                  Supplier records saved
                </p>
              </div>

              <div className="rounded-3xl border border-green-100 bg-white/85 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                <p className="text-sm font-medium text-slate-500">
                  Linked Suppliers
                </p>
                <h2 className="mt-3 text-4xl font-black text-green-600">
                  {suppliersWithProducts}
                </h2>
                <p className="mt-3 text-xs text-slate-500">
                  Suppliers with products
                </p>
              </div>

              <div className="rounded-3xl border border-orange-100 bg-white/85 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
                <p className="text-sm font-medium text-slate-500">
                  Unlinked Suppliers
                </p>
                <h2 className="mt-3 text-4xl font-black text-orange-600">
                  {suppliersWithoutProducts}
                </h2>
                <p className="mt-3 text-xs text-slate-500">
                  Suppliers without products
                </p>
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, phone, or address..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 md:max-w-md"
              />

              <p className="mt-4 text-sm text-slate-500">
                Showing {filteredSuppliers.length} of {suppliers.length}{" "}
                suppliers
              </p>
            </section>

            {/* Mobile cards */}
            <section className="mt-5 grid gap-4 md:hidden">
              {filteredSuppliers.length === 0 && (
                <div className="rounded-3xl border border-white/60 bg-white/90 p-8 text-center text-sm text-slate-500 shadow-xl">
                  No suppliers match your search.
                </div>
              )}

              {filteredSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-black text-slate-950">
                        {supplier.name}
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        {supplier.email || "No email"}
                      </p>
                    </div>

                    {supplier.products.length > 0 ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        Linked
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        None
                      </span>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="mt-1 break-all text-sm font-bold text-slate-900">
                        {supplier.phone || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Products</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {supplier.products.length}
                      </p>
                    </div>

                    <div className="col-span-2 rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Address</p>
                      <p className="mt-1 break-all text-sm font-bold text-slate-900">
                        {supplier.address || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => router.push(`/suppliers/${supplier.id}/edit`)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteSupplier(supplier.id)}
                      className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </section>

            {/* Desktop table */}
            <section className="mt-5 hidden overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-xl backdrop-blur md:block">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="px-5 py-4 text-sm font-semibold">Name</th>
                    <th className="px-5 py-4 text-sm font-semibold">Email</th>
                    <th className="px-5 py-4 text-sm font-semibold">Phone</th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Address
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Products
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSuppliers.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        No suppliers match your search.
                      </td>
                    </tr>
                  )}

                  {filteredSuppliers.map((supplier) => (
                    <tr
                      key={supplier.id}
                      className="border-t border-slate-100 transition hover:bg-blue-50/60"
                    >
                      <td className="px-5 py-4 text-sm font-bold text-slate-950">
                        {supplier.name}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {supplier.email || "N/A"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {supplier.phone || "N/A"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {supplier.address || "N/A"}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {supplier.products.length > 0 ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            {supplier.products.length} linked
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                            None
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              router.push(`/suppliers/${supplier.id}/edit`)
                            }
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 hover:shadow"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteSupplier(supplier.id)}
                            className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500 hover:shadow"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}