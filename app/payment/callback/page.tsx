// app/payment/callback/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

// ── Inner component that uses useSearchParams ──────────────────────────────
function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    const getOrderNumber = async (orderId: number): Promise<string | null> => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.ok) {
          const data = await response.json();
          return data.order_number;
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
      return null;
    };

    const verifyPayment = async () => {
      const reference = searchParams.get("reference") || searchParams.get("trxref");

      if (!reference) {
        setStatus("failed");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/verify/${reference}/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const orderNum = data.transaction?.order
            ? await getOrderNumber(data.transaction.order)
            : sessionStorage.getItem("pending_order");

          setOrderNumber(orderNum);
          setStatus("success");
          sessionStorage.removeItem("pending_order");

          setTimeout(() => {
            router.push(`/order-confirmation?order=${orderNum}`);
          }, 3000);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-4 text-4xl">⏳</div>
        <h1 className="mb-4 text-2xl font-bold">Verifying Your Payment...</h1>
        <p className="text-gray-600">Please wait while we confirm your transaction.</p>
        <div className="mt-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-4 text-4xl">✅</div>
        <h1 className="mb-4 text-2xl font-bold text-green-600">Payment Successful!</h1>
        <p className="text-gray-600">
          Your payment has been confirmed. Redirecting you to your order confirmation...
        </p>
        <div className="mt-6">
          <Link
            href={`/order-confirmation?order=${orderNumber}`}
            className="text-primary hover:underline"
          >
            Click here if you are not redirected automatically
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="mb-4 text-4xl">❌</div>
      <h1 className="mb-4 text-2xl font-bold text-red-600">Payment Failed</h1>
      <p className="text-gray-600">
        We couldn&apos;t verify your payment. Please try again or contact support.
      </p>
      <div className="mt-6 space-x-4">
        <Link
          href="/cart"
          className="inline-block rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90"
        >
          Return to Cart
        </Link>
        <Link
          href="/contact-us"
          className="inline-block rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}

// ── Fallback shown while searchParams resolves ─────────────────────────────
function PaymentCallbackFallback() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="mb-4 text-4xl">⏳</div>
      <h1 className="mb-4 text-2xl font-bold">Loading...</h1>
      <div className="mt-4">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    </div>
  );
}

// ── Page export wraps content in Suspense ──────────────────────────────────
export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<PaymentCallbackFallback />}>
      <PaymentCallbackContent />
    </Suspense>
  );
}