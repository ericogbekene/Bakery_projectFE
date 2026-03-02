"use client";

import { Cart } from "@/lib/services/cart-service";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface OrderSummaryProps {
  cart: Cart | null;
  isLoading?: boolean;
  isSubmitting?: boolean;
}

export function OrderSummary({
  cart,
  isLoading = false,
  isSubmitting = false,
}: OrderSummaryProps) {
  const router = useRouter();

  if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
    return (
      <div className="border rounded p-4 sticky top-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <p className="text-gray-500 text-center py-4">Your cart is empty</p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push("/products")}
        >
          Add Items to Cart
        </Button>
      </div>
    );
  }

  const subtotal = cart.cart_items.reduce(
    (sum, item) => sum + parseFloat(item.total_price),
    0
  );
  const tax = subtotal * 0.1; // Assuming 10% tax
  const total = subtotal + tax;

  return (
    <div className="border rounded p-4 sticky top-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      {/* Items */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {cart.cart_items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-gray-500 text-xs">
                {item.quantity} × ${parseFloat(item.product.price).toFixed(2)}
              </p>
            </div>
            <span className="font-semibold">
              ${parseFloat(item.total_price).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t pt-3 mb-3">
        {/* Subtotal */}
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-600">Tax (10%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        {/* Total */}
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span className="text-c-pink-500">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Item count badge */}
      <div className="text-xs text-gray-500 text-center pt-2">
        {cart.cart_items.length}{" "}
        {cart.cart_items.length === 1 ? "item" : "items"} in cart
      </div>

      {isLoading && (
        <div className="mt-4 p-2 bg-blue-50 text-blue-700 text-sm rounded text-center">
          Loading cart details...
        </div>
      )}

      {isSubmitting && (
        <div className="mt-4 p-2 bg-amber-50 text-amber-700 text-sm rounded text-center">
          Processing your order...
        </div>
      )}
    </div>
  );
}
