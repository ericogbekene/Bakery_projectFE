"use client";

import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Component that uses useSearchParams
function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <main className="pb-12">
      <Container className="mx-auto my-16 flex max-w-lg flex-col items-center space-y-6 text-center">
        {/* Success checkmark */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-12 w-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h1
          className={cn(
            "text-3xl font-semibold text-gray-900",
            poltawskiNowy.className,
          )}
        >
          Order Placed Successfully!
        </h1>

        {/* Order number */}
        {orderNumber && (
          <div className="w-full rounded-lg border bg-gray-50 px-8 py-4">
            <p className="text-sm text-gray-500">Your order number</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {orderNumber}
            </p>
          </div>
        )}

        {/* Message */}
        <p className="max-w-md text-gray-600">
          Thank you for your order! A confirmation email has been sent to you
          with your order details. We will notify you once your order is
          confirmed and being prepared.
        </p>

        {/* What happens next */}
        <div className="w-full space-y-3 rounded-lg border p-6 text-left">
          <h3 className="font-semibold text-gray-900">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-green-500">1.</span>
              <span>We review your order and confirm it within 24 hours.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-green-500">2.</span>
              <span>
                Our team begins preparing your order on the scheduled date.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-green-500">3.</span>
              <span>
                Your order is delivered to your address on the delivery date.
              </span>
            </li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex w-full flex-col gap-4 pt-4 sm:flex-row">
          <Button asChild size="lg" className="flex-1">
            <Link href="/menu">Continue Shopping</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="flex-1">
            <Link href={`/track-order`}>Track Order</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="flex-1">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </Container>
    </main>
  );
}

// Main page component with Suspense boundary
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
