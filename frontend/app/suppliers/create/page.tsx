"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";

export default function CreateSupplierPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  async function handleCreateSupplier(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      await api.post("/suppliers", {
        name,
        email,
        phone,
        address,
      });

      router.push("/suppliers");
    } catch {
      setMessage("Failed to create supplier. Check the fields and try again.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold">Add Supplier</h1>
          <p className="mt-2 text-slate-600">
            Create a new supplier for your inventory.
          </p>
        </div>

        <form
          onSubmit={handleCreateSupplier}
          className="mt-8 space-y-4 rounded-xl bg-white p-6 shadow"
        >
          <div>
            <label className="text-sm font-medium">Supplier Name</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ABC Electronics"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc@example.com"
              type="email"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912345678"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <textarea
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Addis Ababa"
              rows={4}
            />
          </div>

          {message && <p className="text-sm text-red-600">{message}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-white"
            >
              Create Supplier
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
      </div>
    </main>
  );
}