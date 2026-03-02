"use client";

import { useProducts } from "@/lib/hooks/useProducts";
import Container from "@/components/shared/container";
import ProductCard from "@/components/ProductCard";

export default function Page() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <main className="py-12">
        <Container>
          <p>Loading products...</p>
        </Container>
      </main>
    );
  }

  if (error) {
    return (
      <main className="py-12">
        <Container>
          <p className="text-destructive">Error: {error}</p>
        </Container>
      </main>
    );
  }

  return (
    <main className="py-12">
      <Container>
        <h1 className="text-2xl font-bold mb-6">Products</h1>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
