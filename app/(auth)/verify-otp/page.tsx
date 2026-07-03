"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import OtpInput from "../components/otp-input";
import SubmitButton from "../components/submit-button";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState<"REGISTER" | "RESET_PASSWORD">("REGISTER");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/otp-status")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setEmail(data.email);
        setPurpose(data.purpose);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setChecking(false));
  }, [router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (code.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      router.push(data.redirect ?? "/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/resend-otp", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not resend code.");
        return;
      }
      setCooldown(60);
    } catch {
      setError("Could not resend code.");
    } finally {
      setResending(false);
    }
  }

  if (checking) return null;

  return (
    <div>
      <div className="mb-8">
        <div className="w-11 h-11 rounded-xl bg-brand-soft flex items-center justify-center mb-4">
          <ShieldCheck size={20} className="text-brand" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mb-1.5">
          {purpose === "REGISTER" ? "Verify your email" : "Enter reset code"}
        </h2>
        <p className="text-sm text-muted">
          We sent a 6-digit code to <span className="text-ink font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <OtpInput value={code} onChange={setCode} error={error} />
        <SubmitButton loading={loading}>Verify</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Didn&apos;t get the code?{" "}
        <button
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="text-brand font-medium hover:underline disabled:text-muted disabled:no-underline disabled:cursor-not-allowed cursor-pointer"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
        </button>
      </p>
    </div>
  );
}