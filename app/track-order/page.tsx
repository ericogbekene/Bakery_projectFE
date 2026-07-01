"use client";

import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface TimelineEvent {
  action: string;
  description: string;
  timestamp: string;
}

interface OrderTracking {
  order_number: string;
  status: string;
  status_display: string;
  status_color: string;
  created_at: string;
  estimated_ready_date: string | null;
  timeline: TimelineEvent[];
}

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: "🛒" },
  { key: "confirmed", label: "Confirmed", icon: "✅" },
  { key: "processing", label: "Being Prepared", icon: "👨‍🍳" },
  { key: "ready", label: "Ready", icon: "📦" },
  { key: "completed", label: "Delivered", icon: "🎉" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-orange-100 text-orange-800",
  ready: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function Page() {
  const [orderNumber, setOrderNumber] = useState("");
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!orderNumber.trim()) {
      setError("Please enter an order number.");
      return;
    }

    setLoading(true);
    setError("");
    setTracking(null);

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const response = await fetch(
        `${apiBase}/orders/track/?order_number=${encodeURIComponent(orderNumber.trim())}`,
        { credentials: "include" },
      );

      if (!response.ok) {
        setError("Order not found. Please check your order number.");
        return;
      }

      const trackData = await response.json();
      setTracking(trackData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to track order.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = tracking
    ? STATUS_STEPS.findIndex((s) => s.key === tracking.status)
    : -1;

  return (
    <main className="pb-12">
      <Container className="mx-auto my-12 max-w-2xl">
        <h1
          className={cn(
            "mb-2 text-3xl font-semibold text-gray-900",
            poltawskiNowy.className,
          )}
        >
          Track Your Order
        </h1>
        <p className="mb-8 text-gray-500">
          Enter your order number to see the current status of your order.
        </p>

        {/* Search box */}
        <div className="mb-8 flex gap-3">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            placeholder="e.g. ORD-20260508-1D973DB8"
            className="focus:ring-primary h-11 flex-1 rounded-md border border-gray-300 px-4 text-sm focus:ring-2 focus:outline-none"
          />
          <Button size="lg" onClick={handleTrack} disabled={loading}>
            {loading ? "Tracking..." : "Track"}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Tracking result */}
        {tracking && (
          <div className="space-y-6">
            {/* Order info */}
            <div className="space-y-3 rounded-lg border p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {tracking.order_number}
                </h2>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-medium",
                    STATUS_COLORS[tracking.status] ??
                      "bg-gray-100 text-gray-800",
                  )}
                >
                  {tracking.status_display}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Placed on{" "}
                {new Date(tracking.created_at).toLocaleDateString("en-NG", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Progress steps — hide for cancelled orders */}
            {tracking.status !== "cancelled" && (
              <div className="rounded-lg border p-5">
                <h3 className="mb-4 font-semibold text-gray-900">
                  Order Progress
                </h3>
                <div className="relative">
                  {/* Progress line */}
                  <div className="absolute top-5 bottom-5 left-5 w-0.5 bg-gray-200" />
                  <div
                    className="bg-primary absolute top-5 left-5 w-0.5 transition-all duration-500"
                    style={{
                      height:
                        currentStepIndex >= 0
                          ? `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`
                          : "0%",
                    }}
                  />

                  <div className="space-y-6">
                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      return (
                        <div
                          key={step.key}
                          className="relative flex items-center gap-4"
                        >
                          <div
                            className={cn(
                              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg transition-all",
                              isCompleted
                                ? "border-primary bg-primary text-white"
                                : "border-gray-200 bg-white text-gray-400",
                            )}
                          >
                            {step.icon}
                          </div>
                          <div>
                            <p
                              className={cn(
                                "font-medium",
                                isCompleted ? "text-gray-900" : "text-gray-400",
                              )}
                            >
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-primary text-xs font-medium">
                                Current status
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Cancelled state */}
            {tracking.status === "cancelled" && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center">
                <p className="mb-2 text-2xl">❌</p>
                <p className="font-semibold text-red-800">Order Cancelled</p>
                <p className="mt-1 text-sm text-red-600">
                  This order has been cancelled.
                </p>
              </div>
            )}

            {/* Timeline */}
            {tracking.timeline.length > 0 && (
              <div className="rounded-lg border p-5">
                <h3 className="mb-4 font-semibold text-gray-900">
                  Order History
                </h3>
                <div className="space-y-3">
                  {tracking.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <div className="bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {event.action}
                        </p>
                        {event.description && (
                          <p className="text-gray-500">{event.description}</p>
                        )}
                        <p className="mt-0.5 text-xs text-gray-400">
                          {new Date(event.timestamp).toLocaleString("en-NG")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button asChild size="lg" className="flex-1">
                <Link href="/menu">Continue Shopping</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setTracking(null);
                  setOrderNumber("");
                }}
              >
                Track Another Order
              </Button>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
