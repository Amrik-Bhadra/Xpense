"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import FormField from "../components/form-field";
import PasswordField from "../components/password-field";
import SubmitButton from "../components/submit-button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        if (data.redirect) router.push(data.redirect);
        return;
      }

      router.push(data.redirect ?? searchParams.get("next") ?? "/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-1.5">Welcome back</h2>
        <p className="text-sm text-muted">Log in to continue to Xpense.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="email"
          label="Email"
          icon={Mail}
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div>
          <PasswordField
            id="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end mt-2">
            <Link href="/forgot-password" className="text-xs text-brand font-medium hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-negative-soft border border-negative/20 px-3.5 py-2.5 text-xs text-negative">
            {error}
          </div>
        )}

        <SubmitButton loading={loading}>Log in</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-brand font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}