"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Product } from "@/lib/services/product-service";
import { useCart } from "@/lib/hooks/useCart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      // Optionally show a message/snackbar
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  return (
    <div className={cn("border rounded-lg p-4 flex flex-col")}>      
      <Link href={`/products/${product.slug}`}>        
        <img
          src={product.image_url || "/assets/images/placeholder.png"}
          alt={product.name}
          className="w-full h-48 object-cover mb-4 rounded"
        />
      </Link>
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          {product.category_name}
        </p>
        <p className="text-primary font-bold mb-4">
          ${parseFloat(product.price).toFixed(2)}
        </p>
      </div>
      <Button
        variant="default"
        onClick={handleAddToCart}
        className="mt-auto h-10"
      >
        Add to Cart
      </Button>
    </div>
  );
}
