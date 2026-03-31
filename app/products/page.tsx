"use client";

import { useState } from "react";
import { useProducts } from "@/lib/hooks/useProducts";
import Container from "@/components/shared/container";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { products, loading, error } = useProducts({
    category: selectedCategory || undefined,
  });

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
        <h1 className="text-2xl font-bold mb-8">Products</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(products) && products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
