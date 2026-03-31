"use client";

import { useCart } from "@/lib/hooks/useCart";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CartItems() {
  const { cart, loading, removeFromCart, updateQuantity } = useCart();

  if (loading) {
    return <p>Loading cart...</p>;
  }

  // Safe check with fallback to empty array
  const cartItems = cart?.cart_items ?? [];
  if (!cart || cartItems.length === 0) {
    return (
      <div>
        <p className="mb-4">Your cart is empty.</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const handleRemove = async (productId: number) => {
    await removeFromCart(productId);
  };

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Cart Items</h2>
      {cart.cart_items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border rounded p-4"
        >
          <div className="flex-1">
            <h3 className="font-semibold">{item.product.name}</h3>
            <p className="text-sm text-muted-foreground">
              ${parseFloat(item.product.price).toFixed(2)} each
            </p>
          </div>

          <div className="flex items-center gap-2 mx-4">
            <button
              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
              className="px-2 py-1 border rounded"
            >
              −
            </button>
            <span className="w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
              className="px-2 py-1 border rounded"
            >
              +
            </button>
          </div>

          <div className="text-right mx-4">
            <p className="font-semibold">
              ${parseFloat(item.total_price).toFixed(2)}
            </p>
          </div>

          <button
            onClick={() => handleRemove(item.product.id)}
            className="px-3 py-1 text-destructive border border-destructive rounded hover:bg-destructive/10"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
