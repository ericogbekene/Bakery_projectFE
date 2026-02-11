"use client";

import { Button } from "@/components/ui/button";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="bg-primary-100 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1
          className={cn(
            "text-dark-text text-4xl font-bold",
            poltawskiNowy.className,
          )}
        >
          Forgot Password
        </h1>
        <p className="text-text">This feature is coming soon.</p>
        <Button asChild size="lg" className="w-full">
          <Link href="/login">Back to Login</Link>
        </Button>
      </div>
    </main>
  );
}
