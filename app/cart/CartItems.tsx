"use client";

import { Button } from "@/components/ui/button";
import { poltawskiNowy } from "@/lib/font";
import { CartItem, cartService } from "@/lib/services/cart-service";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

// Single cart item row
const CartItemRow = ({ item }: { item: CartItem }) => {
  const queryClient = useQueryClient();

  const removeMutation = useMutation({
    mutationFn: () => cartService.removeCartItem(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Build specs list from item data
  const specs = [
    item.size && { label: "Size", value: `${item.size} inches` },
    item.flavour_1 && {
      label: "Flavour",
      value: item.flavour_1 + (item.flavour_2 ? `, ${item.flavour_2}` : ""),
    },
    item.colours && { label: "Colour", value: item.colours },
    item.cake_topper > 0 && {
      label: "Cake topper",
      value: String(item.cake_topper),
    },
    item.candle > 0 && { label: "Candle", value: String(item.candle) },
    item.birthday_card > 0 && {
      label: "Birthday card",
      value: String(item.birthday_card),
    },
    item.chocolate > 0 && { label: "Chocolate", value: String(item.chocolate) },
    item.wine > 0 && { label: "Wine", value: String(item.wine) },
    item.whiskey_200ml > 0 && {
      label: "Whiskey",
      value: String(item.whiskey_200ml),
    },
    item.additional_notes && { label: "Notes", value: item.additional_notes },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      {/* Product Image */}
      <div className="shrink-0">
        <div className="bg-primary-100 flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl sm:h-48 sm:w-48 lg:h-56 lg:w-56">
          {item.product.thumbnail_url ? (
            <Image
              src={item.product.thumbnail_url}
              alt={item.product.name}
              className="h-full w-full object-contain p-5"
              width={224}
              height={224}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3
          className={cn(
            poltawskiNowy.className,
            "text-dark-text text-lg font-semibold md:text-xl",
          )}
        >
          {item.product.name}
        </h3>

        {/* Specs */}
        <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm md:text-base">
          {specs.map((s, idx) => (
            <li key={`${s.label}-${idx}`} className="whitespace-nowrap">
              <span className="font-medium">{s.label}:</span> {s.value}
            </li>
          ))}
        </ul>

        {/* Pricing */}
        <div className="mt-3 space-y-1 text-sm text-gray-600">
          <p>Qty: {item.quantity}</p>
          <p className="font-semibold text-gray-900">
            ₦{Number(item.total_price).toLocaleString()}
          </p>
          {item.customization_summary && (
            <p className="text-xs text-gray-400">
              {item.customization_summary}
            </p>
          )}
        </div>

        {/* Remove Button */}
        <div className="mt-4">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary-50 h-11 w-full sm:w-44"
            onClick={() => removeMutation.mutate()}
            disabled={removeMutation.isPending}
          >
            {removeMutation.isPending ? "Removing..." : "Remove"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Cart items list
const CartItems = () => {
  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="flex animate-pulse gap-6">
            <div className="h-48 w-48 rounded-2xl bg-gray-200" />
            <div className="flex-1 space-y-3 pt-2">
              <div className="h-5 w-2/3 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
              <div className="h-4 w-1/3 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        Failed to load cart. Please refresh the page.
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-gray-400">Your cart is empty.</p>
        <a href="/menu" className="text-primary mt-4 inline-block underline">
          Browse our menu
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cart header */}
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg font-semibold">
          Your Cart ({cart.item_count} item{cart.item_count !== 1 ? "s" : ""})
        </h2>
        <p className="text-sm text-gray-500">
          Subtotal:{" "}
          <span className="font-semibold text-gray-900">
            ₦{Number(cart.subtotal).toLocaleString()}
          </span>
        </p>
      </div>

      {/* Items */}
      {cart.items.map((item) => (
        <CartItemRow key={item.id} item={item} />
      ))}

      {/* Cart totals */}
      <div className="space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>₦{Number(cart.subtotal).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery</span>
          <span>₦{Number(cart.delivery_cost).toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t pt-2 text-base font-semibold">
          <span>Total</span>
          <span>₦{Number(cart.grand_total).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
