"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../lib/api";

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

  async function handleUpdateSupplier(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await api.patch(`/suppliers/${supplierId}`, {
        name,
        email,
        phone,
        address,
      });

      router.push("/suppliers");
    } catch {
      setMessage("Failed to update supplier. Check the fields and try again.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold">Edit Supplier</h1>
          <p className="mt-2 text-slate-600">
            Update supplier contact information.
          </p>
        </div>

        {message === "Loading supplier..." && (
          <p className="mt-6 text-sm text-slate-700">{message}</p>
        )}

        {message !== "Loading supplier..." && message && (
          <p className="mt-6 text-sm text-red-600">{message}</p>
        )}

        {!message && (
          <form
            onSubmit={handleUpdateSupplier}
            className="mt-8 space-y-4 rounded-xl bg-white p-6 shadow"
          >
            <div>
              <label className="text-sm font-medium">Supplier Name</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>
              <textarea
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
                onClick={() => router.push("/suppliers")}
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