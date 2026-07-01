import Container from "@/components/shared/container";
import { poltawskiNowy } from "@/lib/font";
import { productService } from "@/lib/services/product-service";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Next.js 15: params is a Promise
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch category + its products by slug
  let category;
  let productsData;

  try {
    category = await productService.getCategoryBySlug(slug);
  } catch {
    notFound();
  }

  try {
    productsData = await productService.getProducts({
      category: slug, // Django accepts slug via existing fix
    });
  } catch {
    productsData = { results: [], count: 0 };
  }

  const products = productsData.results ?? [];

  return (
    <main>
      <Container className="my-8">
        {/* Category Header */}
        <header className="mb-8">
          <h1
            className={cn(
              poltawskiNowy.className,
              "text-dark-text text-2xl font-semibold lg:text-3xl",
            )}
          >
            {category.name}
          </h1>
          <p className="mt-2 text-gray-500">
            {category.product_count ?? products.length} item
            {products.length !== 1 ? "s" : ""} available
          </p>
        </header>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            No products available in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/menu/cakes/order/${product.slug}`}
                className="group block overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
              >
                {/* Product Image */}
                <div className="bg-primary-100 flex aspect-[4/3] items-center justify-center overflow-hidden">
                  {product.thumbnail_url ? (
                    <Image
                      src={product.thumbnail_url}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  {product.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {product.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      From ₦{Number(product.price).toLocaleString()}
                    </span>
                    {product.preparation_days && (
                      <span className="text-xs text-gray-400">
                        {product.preparation_days} day
                        {product.preparation_days > 1 ? "s" : ""} prep
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}