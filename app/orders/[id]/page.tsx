"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import orderService, { Order } from "@/lib/services/order-service";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

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
          <div className="max-w-md">
            <p className="text-destructive mb-4">
              {error || "Order not found"}
            </p>
            <Button onClick={() => router.push("/products")}>
              Back to Products
            </Button>
          </div>
        </Container>
      </main>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="py-12">
      <Container>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          ← Back
        </Button>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">Order Details</h1>

          <div className="grid grid-cols-1 gap-6">
            {/* Order Header */}
            <div className="border rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="text-lg font-semibold">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="text-lg">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold capitalize">
                    {order.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-semibold">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                Customer Information
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {order.customer_name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {order.customer_email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {order.customer_phone}
                </p>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                Delivery Information
              </h2>
              <p className="mb-4">
                <span className="font-semibold">Address:</span>
              </p>
              <p className="text-muted-foreground">
                {order.delivery_address}
              </p>
              {order.special_instructions && (
                <>
                  <p className="font-semibold mt-4 mb-2">
                    Special Instructions:
                  </p>
                  <p className="text-muted-foreground">
                    {order.special_instructions}
                  </p>
                </>
              )}
            </div>

            {/* Order Items */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between py-2 border-b last:border-b-0"
                  >
                    <span>Product ID: {item.product_id}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
              <p>
                <span className="font-semibold">Payment Method:</span>{" "}
                {order.payment_method.replace("_", " ").toUpperCase()}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Button onClick={() => router.push("/products")} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
