import Container from "@/components/shared/container";
import MenuHero from "@/components/shared/menu-hero";
import { Button } from "@/components/ui/button";
import { poltawskiNowy } from "@/lib/font";
import { productService } from "@/lib/services/product-service";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  let pastries: Awaited<
    ReturnType<typeof productService.getPastries>
  >["results"] = [];

  try {
    const data = await productService.getPastries();
    pastries = data.results ?? [];
  } catch (error) {
    console.error("Failed to fetch pastries:", error);
  }

  return (
    <main className="pb-12">
      <MenuHero />
      <Container className="my-8 lg:my-16 lg:mt-8">
        {pastries.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-lg">No pastries available at the moment.</p>
            <p className="mt-2 text-sm">Please check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pastries.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-b shadow-md"
              >
                {/* Image */}
                <div className="bg-primary-300 flex aspect-[380/306] items-center justify-center overflow-hidden rounded-t">
                  {item.thumbnail_url ? (
                    <Image
                      src={item.thumbnail_url}
                      alt={item.name}
                      width={380}
                      height={306}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="text-dark-text px-3 py-4 text-center">
                  <h6
                    className={cn(
                      "mb-2 text-lg font-semibold lg:text-xl",
                      poltawskiNowy.className,
                    )}
                  >
                    {item.name}
                  </h6>
                  {item.description && (
                    <p className="line-clamp-3 text-sm text-gray-600">
                      {item.description}
                    </p>
                  )}
                  <p className="mt-2 font-semibold text-gray-900">
                    ₦{Number(item.price).toLocaleString()}
                  </p>
                  <Button
                    className="text-primary hover:text-primary-700 mx-auto mt-2 block w-fit text-base underline"
                    variant="link"
                    asChild
                  >
                    <Link
                      href={`/menu/pastries/order?title=${encodeURIComponent(item.name)}&id=${item.id}`}
                    >
                      Order now
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
