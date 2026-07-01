"use client";
import { poltawskiNowy } from "@/lib/font";
import { productService } from "@/lib/services/product-service";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Container from "../shared/container";
import { Button } from "../ui/button";

const HomeCategories = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
  });
  const categories = data?.results ?? [];
  return (
    <Container className="space-y-8 pt-16 pb-8">
      <header className="space-y-4 text-center">
        <h4
          className={cn(
            "text-dark-text text-3xl font-semibold max-lg:text-xl",
            poltawskiNowy.className,
          )}
        >
          Browse through our category{" "}
        </h4>
        <p>
          Browse through our categories and discover some mouth watering tasty
          treats.
        </p>
      </header>
      {isLoading && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="bg-custom-green-100 aspect-[383/335] animate-pulse rounded-xl" />
              <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      )}
      {isError && (
        <p className="text-center text-gray-500">
          Couldn&apos;t load categories right now. Please try again later.
        </p>
      )}
      {!isLoading && !isError && categories.length > 0 && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/menu/${category.slug}`}
              className="group space-y-4"
            >
              <div className="bg-custom-green-100 flex aspect-[383/335] items-center justify-center rounded-xl">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    height={100}
                    width={100}
                    className="aspect-[365/272] w-full max-w-xs object-contain transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="text-dark-text/40 text-sm">No image</div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-text font-semibold">
                  {category.name}
                </span>
                <Button
                  variant={"ghost"}
                  size={"lg"}
                  className="text-gold-400 pointer-events-none flex items-center space-x-2 text-base"
                  asChild={false}
                  tabIndex={-1}
                >
                  Explore <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
};

export default HomeCategories;