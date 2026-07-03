"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import FormField from "../components/form-field";
import SubmitButton from "../components/submit-button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      router.push("/verify-otp");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to login
      </Link>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-1.5">Forgot password?</h2>
        <p className="text-sm text-muted">Enter your email and we&apos;ll send you a code to reset it.</p>
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

        {error && (
          <div className="rounded-xl bg-negative-soft border border-negative/20 px-3.5 py-2.5 text-xs text-negative">
            {error}
          </div>
        )}

        <SubmitButton loading={loading}>Send reset code</SubmitButton>
      </form>
    </div>
  );
}