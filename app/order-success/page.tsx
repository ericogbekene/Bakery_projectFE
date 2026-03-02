"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/hooks/useCart";
import orderService, { Order } from "@/lib/services/order-service";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const { refreshCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }

      try {
        const data = await orderService.getOrder(Number(orderId));
        setOrder(data);
        // Refresh cart to reflect cleared state
        refreshCart();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, refreshCart]);

  if (loading) {
    return (
      <main className="py-12">
        <Container>
          <p>Loading order details...</p>
        </Container>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="py-12">
        <Container>
          <div className="max-w-md mx-auto">
            <p className="text-destructive mb-4">{error || "Order not found"}</p>
            <Button onClick={() => router.push("/")} className="w-full">
              Return to Home
            </Button>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="py-12">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your order. It will be processed soon.
            </p>
          </div>

          <div className="bg-accent rounded-lg p-6 mb-8">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-2xl font-semibold">{order.order_number}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Order Total</p>
                <p className="text-lg font-semibold">
                  ${parseFloat(order.total_amount).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold capitalize">
                  {order.status}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Delivery Address
              </p>
              <p className="text-left">{order.delivery_address}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.push(`/orders/${order.id}`)}
              className="w-full"
            >
              View Order Details
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/products")}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
