import Container from "@/components/shared/container";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";
import { productService } from "@/lib/services/product-service";
import OrderForm from "./order-form";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  let product;
  try {
    product = await productService.getProduct(slug);
  } catch {
    notFound();
  }

  if (!product || product.product_type !== "cake") {
    notFound();
  }

  return (
    <main>
      <Container className="my-8 grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-[1fr_2fr] lg:items-start">
        <div>
          <div className="bg-primary-100 flex aspect-[380/306] items-center justify-center overflow-hidden rounded-t">
            {product.medium_image_url ? (
              <Image
                src={product.medium_image_url}
                alt={product.name}
                height={400}
                width={400}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                No image
              </div>
            )}
          </div>
        </div>
        <div>
          <header className="mb-8 space-y-1">
            <h3 className={cn(poltawskiNowy.className, "text-dark-text text-xl font-semibold lg:text-2xl")}>
              {product.name}
            </h3>
            {product.description && (
              <p className="text-gray-600">{product.description}</p>
            )}
            {product.layers && product.covering && (
              <p className="text-sm text-gray-500">
                {product.layers} layer{product.layers > 1 ? "s" : ""} · {product.covering.replace("_", " ")}
              </p>
            )}
          </header>
          <OrderForm productId={product.id} slug={slug} />
        </div>
      </Container>
    </main>
  );
}
