"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../lib/api";
import AppLayout from "../../../../components/layout/AppLayout";

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

      await api.patch(`/suppliers/${supplierId}`, {
        name,
        email,
        phone,
        address,
      });

      router.push("/suppliers");
    } catch {
      setMessage("Failed to update supplier. Please check your inputs.");
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-6 text-white shadow-2xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-200">
                Supplier Management
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                Edit Supplier
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Update supplier contact details, including email, phone number,
                and address information.
              </p>
            </div>

            <button
              onClick={() => router.push("/suppliers")}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 md:w-auto"
            >
              Back to Suppliers
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur md:p-8">
          {message === "Loading supplier..." ? (
            <p className="rounded-2xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
              {message}
            </p>
          ) : (
            <form onSubmit={handleUpdateSupplier} className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Supplier Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Phone
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Address
                  </label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {message && (
                <p className="rounded-2xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
                  {message}
                </p>
              )}

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => router.push("/suppliers")}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 hover:shadow"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </AppLayout>
  );
}