"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    try {
      setMessage("Logging in...");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      router.push("/dashboard");
    } catch {
      setMessage("Login failed. Please check your email and password.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur lg:grid-cols-2">
          <section className="hidden bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-black shadow-lg">
                  IP
                </div>

                <div>
                  <h1 className="text-2xl font-black">InventoryPro</h1>
                  <p className="text-sm text-blue-200">
                    Smart inventory control
                  </p>
                </div>
              </div>

              <div className="mt-16">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-200">
                  Welcome Back
                </p>

                <h2 className="mt-4 text-5xl font-black leading-tight">
                  Manage stock with confidence.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
                  Track products, suppliers, inventory value, and low-stock
                  alerts from one clean dashboard.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-2xl font-black">CRUD</p>
                <p className="mt-1 text-xs text-slate-300">Products</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-2xl font-black">JWT</p>
                <p className="mt-1 text-xs text-slate-300">Auth</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-2xl font-black">Live</p>
                <p className="mt-1 text-xs text-slate-300">Stats</p>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black text-white shadow-lg">
                    IP
                  </div>

                  <div>
                    <h1 className="text-xl font-black text-slate-950">
                      InventoryPro
                    </h1>
                    <p className="text-xs text-slate-500">
                      Smart inventory control
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Login to your account
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Enter your credentials to continue to your dashboard.
                </p>
              </div>

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                    placeholder="Enter your password"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {message && (
                  <p className="rounded-2xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-500"
                >
                  Login
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => router.push("/register")}
                  className="font-bold text-blue-600 hover:text-blue-500"
                >
                  Create one
                </button>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}