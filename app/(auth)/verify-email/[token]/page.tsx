"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounts/verify-email/${token}/`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully.");
          // Redirect to login after 3 seconds
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(
            data.message || data.detail || "This verification link is invalid or has expired.",
          );
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error. Please check your connection and try again.");
      });
  }, [token, router]);

  return (
    <main className="bg-primary-100 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 text-center shadow-lg">

        {/* LOADING */}
        {status === "loading" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <svg
                className="text-primary h-8 w-8 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </div>
            <h1 className={cn("text-dark-text text-3xl font-bold", poltawskiNowy.className)}>
              Verifying your email...
            </h1>
            <p className="text-gray-500">Please wait a moment.</p>
          </>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className={cn("text-dark-text text-3xl font-bold", poltawskiNowy.className)}>
              Email Verified!
            </h1>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400">Redirecting you to login...</p>
            <Button asChild size="lg" className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          </>
        )}

        {/* ERROR */}
        {status === "error" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className={cn("text-dark-text text-3xl font-bold", poltawskiNowy.className)}>
              Verification Failed
            </h1>
            <p className="text-gray-600">{message}</p>
            <div className="space-y-3">
              <Button asChild size="lg" className="w-full">
                <Link href="/register">Register Again</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/login">Back to Login</Link>
              </Button>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
