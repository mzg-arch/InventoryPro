"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import AuthShell from "../../components/layout/AuthShell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    try {
      setMessage("Creating account...");
      await api.post("/auth/register", { name, email, password });
      router.push("/login");
    } catch {
      setMessage("Registration failed. Please try again.");
    }
  }

  const isSubmitting = message === "Creating account...";

  return (
    <AuthShell
      eyebrow="New account"
      title="Create your workspace"
      description="Enter your details to start managing products, suppliers, and stock."
      footer={
        <>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="rounded-sm font-semibold text-text-primary underline decoration-border-strong underline-offset-4 outline-none hover:decoration-subtle-accent focus-visible:ring-2 focus-visible:ring-subtle-accent/20"
          >
            Log in
          </button>
        </>
      }
    >
      <form onSubmit={handleRegister} className="mt-7 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Your full name"
          />
        </div>

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
            autoComplete="new-password"
            placeholder="Create a password"
          />
        </div>

        {message && (
          <p className="status-message" role="status" aria-live="polite">
            {message}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
