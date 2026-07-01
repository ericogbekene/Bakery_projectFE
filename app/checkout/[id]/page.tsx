// app/checkout/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface OrderDelivery {
  delivery_date: string;
  address: string;
  city: string;
}

interface OrderDetail {
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: string | number;
  payment_status: string;
  status: string;
  delivery?: OrderDelivery;
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push(`/login?next=/checkout/${orderId}`);
      return;
    }
  }, [orderId, router]);

  // Fetch order details
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/checkout/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          router.push(`/login?next=/checkout/${orderId}`);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.message || "Failed to fetch order");
        }

        const data = await response.json();
        setOrder(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load order details";
        console.error("Error fetching order:", err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  // Handle payment
  const handlePayment = async () => {
    if (!order) return;

    try {
      setProcessing(true);
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push(`/login?next=/checkout/${orderId}`);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/initialize/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_number: order.order_number,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Payment initialization failed");
      }

      if (data.payment_link) {
        sessionStorage.setItem("pending_order", order.order_number);
        window.location.href = data.payment_link;
      } else {
        throw new Error("No payment link received");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to initiate payment. Please try again.";
      console.error("Payment error:", err);
      setError(message);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">✕</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition"
              >
                Try Again
              </button>
              <Link href="/cart" className="block w-full">
                <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition">
                  Return to Cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn&apos;t find the order you&apos;re looking for.</p>
          <Link href="/cart" className="block">
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition">
              Return to Cart
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if order is already paid
  if (order.payment_status === "paid") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 text-center border-green-200 border-2">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-green-600 mb-2">Payment Already Completed</h2>
          <p className="text-gray-600 mb-4">This order has already been paid for.</p>
          <div className="bg-gray-50 rounded-md p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number</span>
              <span className="font-medium">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-medium">₦{Number(order.total_amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="font-medium text-green-600">Paid</span>
            </div>
          </div>
          <Link href={`/order-confirmation?order=${order.order_number}`} className="block">
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition">
              View Order
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if order is cancelled
  if (order.status === "cancelled") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 text-center border-red-200 border-2">
          <div className="text-red-500 text-5xl mb-4">✕</div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Order Cancelled</h2>
          <p className="text-gray-600 mb-6">This order has been cancelled and cannot be paid for.</p>
          <Link href="/cart" className="block">
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition">
              Return to Cart
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Normal flow - show payment button
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          ← Back to Cart
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Complete Your Payment</h1>
                <p className="text-gray-500 text-sm mt-1">Order #{order.order_number}</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                Pending Payment
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Order summary */}
            <div className="bg-gray-50 rounded-md p-4 space-y-3">
              <h4 className="font-medium text-gray-900 text-sm">Order Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer</span>
                  <span className="font-medium">{order.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{order.customer_email}</span>
                </div>
                {order.delivery && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Date</span>
                      <span className="font-medium">
                        {new Date(order.delivery.delivery_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address</span>
                      <span className="font-medium text-right">
                        {order.delivery.address}, {order.delivery.city}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount</span>
                <span className="text-primary">₦{Number(order.total_amount).toLocaleString()}</span>
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
              <p>🔒 Payment will be processed securely via Paystack. You can pay with your card, bank transfer, or USSD.</p>
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50">
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full h-12 text-base"
              size="lg"
            >
              {processing ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></span>
                  Processing...
                </>
              ) : (
                `Pay Now ₦${Number(order.total_amount).toLocaleString()}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}