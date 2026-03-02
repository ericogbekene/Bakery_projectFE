"use client";

import { CartProvider } from "@/lib/hooks/useCart";

export default function CartProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
