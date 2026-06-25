"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/password-reset/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data?.email?.[0] || data?.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ──────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="bg-primary-100 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="text-5xl">📬</div>
          <h1 className={cn("text-dark-text text-3xl font-bold", poltawskiNowy.className)}>
            Check your email
          </h1>
          <p className="text-text">
            If an account exists for <strong>{email}</strong>, we've sent a
            password reset link. Please check your inbox.
          </p>
          <p className="text-text text-sm">Didn't receive it? Check your spam folder.</p>
          <Button asChild size="lg" className="w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      </main>
    );
  }

  // ── Form state ─────────────────────────────────────────────────
  return (
    <main className="bg-primary-100 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className={cn("text-dark-text text-4xl font-bold", poltawskiNowy.className)}>
            Forgot Password
          </h1>
          <p className="text-text mt-2 text-sm">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-dark-text text-sm font-medium">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <p className="text-text text-center text-sm">
          Remember your password?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}
