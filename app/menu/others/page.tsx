import Container from "@/components/shared/container";
import MenuHero from "@/components/shared/menu-hero";
import { Button } from "@/components/ui/button";
import { poltawskiNowy } from "@/lib/font";
import { productService } from "@/lib/services/product-service";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  let others: Awaited<
    ReturnType<typeof productService.getProducts>
  >["results"] = [];

  try {
    const data = await productService.getProducts({ category: "others" });
    others = data.results ?? [];
  } catch (error) {
    console.error("Failed to fetch others:", error);
  }

  return (
    <main className="pb-12">
      <MenuHero />
      <Container className="my-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:my-16 lg:mt-8 lg:grid-cols-3">
        {others.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-gray-400">
            <p className="text-lg">No items available at the moment.</p>
          </div>
        ) : (
          others.map((item) => (
            <div key={item.id} className="shadow-md">
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
                    href={`/menu/others/order?title=${encodeURIComponent(item.name)}&id=${item.id}`}
                  >
                    Order now
                  </Link>
                </Button>
              </div>
            </div>
          ))
        )}
      </Container>
    </main>
  );
}
