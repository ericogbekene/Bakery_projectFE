"use client";

import { useCart } from "@/lib/hooks/useCart";
import { useProducts } from "@/lib/hooks/useProducts";
import { Product } from "@/lib/services/product-service";
import Image from "next/image";

/**
 * Example component demonstrating how to use the new API structure
 * This shows a product list with cart functionality
 */
export default function ProductListExample() {
  const { products, loading, error, refetch } = useProducts({ page_size: 6 });
  const { addToCart, isInCart, getTotalItems } = useCart();

  const handleAddToCart = async (productId: number) => {
    // CORRECT: addToCart expects (productId, quantity)
    const result = await addToCart(productId, 1);

    if (result.success) {
      alert("Product added to cart!");
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold text-red-600">
          Error Loading Products
        </h3>
        <p className="mb-4 text-gray-600">{error}</p>
        <button
          onClick={refetch}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Our Products</h2>
        <div className="text-sm text-gray-600">
          Cart: {getTotalItems()} items
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product: Product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-lg bg-white shadow-md"
          >
            <div className="aspect-w-16 aspect-h-9">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={340}
                  height={192}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 w-full items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
              <p className="mb-2 text-sm text-gray-600">
                {product.category_name}
              </p>
              <p className="mb-3 text-xl font-bold text-green-600">
                ${product.price}
              </p>

              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`rounded px-2 py-1 text-sm ${
                    product.available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.available ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <button
                onClick={() => handleAddToCart(product.id)}
                disabled={!product.available || isInCart(product.id)}
                className={`w-full rounded px-4 py-2 font-medium ${
                  !product.available || isInCart(product.id)
                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {isInCart(product.id) ? "In Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="py-12 text-center">
          <h3 className="mb-2 text-lg font-semibold text-gray-600">
            No Products Found
          </h3>
          <p className="text-gray-500">
            Try refreshing the page or check back later.
          </p>
        </div>
      )}
    </div>
  );
}
