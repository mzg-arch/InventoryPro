"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import AuthShell from "../../components/layout/AuthShell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    try {
      setMessage("Logging in...");
      const response = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      router.push("/dashboard");
    } catch {
      setMessage("Login failed. Please check your email and password.");
    }
  }

  const isSubmitting = message === "Logging in...";

  return (
    <AuthShell
      eyebrow="Account access"
      title="Welcome back"
      description="Enter your credentials to continue to your inventory workspace."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="rounded-sm font-semibold text-text-primary underline decoration-border-strong underline-offset-4 outline-none hover:decoration-subtle-accent focus-visible:ring-2 focus-visible:ring-subtle-accent/20"
          >
            Create one
          </button>
        </>
      }
    >
      <form onSubmit={handleLogin} className="mt-7 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
          />
        </div>

        {message && (
          <p className="status-message" role="status" aria-live="polite">
            {message}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}
