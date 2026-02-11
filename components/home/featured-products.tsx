"use client";

import ENDPOINTS from "@/constants/endpoints";
import useQueryAction from "@/hooks/use-query-action";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Container from "../shared/container";

const FeaturedProducts = () => {
  const { data } = useQueryAction<T.Product[]>({
    url: ENDPOINTS.GET_FEATURED_PRODUCTS,
    key: ["products", "featured"],
  });

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
        {data?.map((product, index) => (
          <div key={index} className="overflow-hidden rounded-t-lg">
            <div className="bg-primary-300 flex aspect-[380/306] items-center justify-center">
              <Image
                src={product.image_url}
                alt={product.name}
                height={100}
                width={100}
                className="aspect-[365/300] w-full max-w-xs object-contain"
              />
            </div>
            <div className="border p-4 shadow-lg">
              <p className="text-dark-text mb-1 font-semibold">
                {product.name}
              </p>
              <div className="flex items-center justify-between">
                <span>₦{Number(product.price).toLocaleString()}</span>
                <button className="border-text flex h-10 w-10 items-center justify-center rounded-full border">
                  <ArrowRightIcon className="text-text h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default FeaturedProducts;
