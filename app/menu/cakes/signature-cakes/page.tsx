"use client";

import Container from "@/components/shared/container";
import MenuHero from "@/components/shared/menu-hero";
import { Button } from "@/components/ui/button";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import { useProducts } from "@/lib/hooks/useProducts";
import Image from "next/image";
import Link from "next/link";

export default function SignatureCakesPage() {
  const { products, loading, error } = useProducts({ 
    category: 'signature-cakes' 
  });
  if (loading) {
    return (
      <main className="pb-12">
        <MenuHero />
        <Container className="my-8 lg:my-16">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg">Loading signature cakes...</p>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pb-12">
        <MenuHero />
        <Container className="my-8 lg:my-16">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-lg text-red-600 mb-4">Error loading products</p>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="pb-12">
      <MenuHero />
      <Container className="my-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:my-16 lg:mt-8 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="shadow-md">
            <div className="bg-primary-300 flex aspect-[380/306] items-center justify-center overflow-hidden rounded-t">
              <Image
                src={product.image}
                alt={product.title}
                className="h-full w-full object-contain"
                width={380}
                height={306}
              />
            </div>
            <div className="text-dark-text px-3 py-4 text-center">
              <h6
                className={cn(
                  "mb-2 text-lg font-semibold lg:text-xl",
                  poltawskiNowy.className,
                )}
              >
                {product.title}
              </h6>
              <p>{product.description}</p>
              {product.price && (
                <p className="text-lg font-semibold text-primary mt-2">
                  ₦{product.price.toLocaleString()}
                </p>
              )}
              <Button
                className="text-primary hover:text-primary-700 mx-auto block w-fit text-base underline"
                variant="link"
                asChild
              >
                <Link href={`/menu/cakes/order`}>Order now</Link>
              </Button>
            </div>
          </div>
        ))}
      </Container>
    </main>
  );
} 