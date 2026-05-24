"use client";

import { cartService } from "@/lib/services/cart-service";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CartLink = ({ onClick }: { onClick?: () => void }) => {
  const pathname = usePathname();

  const { data: count } = useQuery({
    queryKey: ["cart-count"],
    queryFn: () => cartService.getCartCount(),
    refetchInterval: 30 * 1000, // refresh every 30 seconds
    staleTime: 10 * 1000,
  });

  return (
    <Link
      href="/cart"
      onClick={onClick}
      className={cn(
        "text-text hover:text-primary relative font-medium transition-colors duration-200 ease-in-out",
        pathname.startsWith("/cart") && "text-primary",
      )}
    >
      Cart
      {count !== undefined && count > 0 && (
        <span className="bg-primary absolute -top-2 -right-4 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
};

export default CartLink;
