"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import PasswordField from "../components/password-field";
import SubmitButton from "../components/submit-button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      router.push(data.redirect ?? "/login");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="w-11 h-11 rounded-xl bg-brand-soft flex items-center justify-center mb-4">
          <KeyRound size={20} className="text-brand" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mb-1.5">Set a new password</h2>
        <p className="text-sm text-muted">Make it strong — at least 8 characters.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField
          id="password"
          label="New password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && (
          <div className="rounded-xl bg-negative-soft border border-negative/20 px-3.5 py-2.5 text-xs text-negative">
            {error}
          </div>
        )}

        <SubmitButton loading={loading}>Reset password</SubmitButton>
      </form>
    </div>
  );
}