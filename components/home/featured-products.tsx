"use client";

import ENDPOINTS from "@/constants/endpoints";
import useQueryAction from "@/hooks/use-query-action";
import { poltawskiNowy } from "@/lib/font";
import * as T from "@/lib/services/product-service";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Container from "../shared/container";

const FeaturedProducts = () => {
  // Fetch products from API - get first 3 products
  const { data, isLoading, error } = useQueryAction<T.ProductListResponse>({
    url: `${ENDPOINTS.EXTERNAL.PRODUCTS.LIST}?page_size=3`,
    key: ["products", "featured"],
  });

  // Extract products from the response
  const products = data?.results || [];

  // Show loading state
  if (isLoading) {
    return (
      <Container className="space-y-8 py-12">
        <h4
          className={cn(
            "text-dark-text text-center text-2xl font-semibold max-lg:text-lg",
            poltawskiNowy.className,
          )}
        >
          Featured Products
        </h4>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[380/306] rounded-t-lg bg-gray-200"></div>
              <div className="border p-4 shadow-lg">
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container className="space-y-8 py-12">
        <h4
          className={cn(
            "text-dark-text text-center text-2xl font-semibold max-lg:text-lg",
            poltawskiNowy.className,
          )}
        >
          Featured Products
        </h4>
        <div className="text-center text-red-500">
          Failed to load products. Please try again later.
        </div>
      </Container>
    );
  }

  // Don't render if no products
  if (products.length === 0) {
    return null;
  }

  return (
    <Container className="space-y-8 py-12">
      <h4
        className={cn(
          "text-dark-text text-center text-2xl font-semibold max-lg:text-lg",
          poltawskiNowy.className,
        )}
      >
        Featured Products
      </h4>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const isCake = product.product_type === "cake";

          const cardContent = (
            <>
              <div className="bg-primary-300 flex aspect-[380/306] items-center justify-center">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="aspect-[365/300] w-full max-w-xs object-contain"
                  />
                ) : (
                  <div className="flex aspect-[365/300] w-full max-w-xs items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <div className="border p-4 shadow-lg">
                <p className="text-dark-text mb-1 font-semibold">
                  {product.name}
                </p>
                <div className="flex items-center justify-between">
                  <span>₦{Number(product.price).toLocaleString()}</span>
                  <span className="border-text flex h-10 w-10 items-center justify-center rounded-full border">
                    <ArrowRightIcon className="text-text h-5 w-5" />
                  </span>
                </div>
              </div>
            </>
          );

          if (isCake) {
            return (
              <Link
                key={product.id}
                href={`/menu/cakes/order/${product.slug}`}
                className="group block overflow-hidden rounded-t-lg"
              >
                {cardContent}
              </Link>
            );
          }

          return (
            <div key={product.id} className="overflow-hidden rounded-t-lg">
              {cardContent}
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default FeaturedProducts;