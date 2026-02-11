'use client';

import React from 'react';
import { useProducts } from '@/lib/hooks/useProducts';
import { useCart } from '@/lib/hooks/useCart';
import Image from 'next/image';

/**
 * Example component demonstrating how to use the new API structure
 * This shows a product list with cart functionality
 */
export default function ProductListExample() {
  const { products, loading, error, refetch } = useProducts({ limit: 6 });
  const { addToCart, isInCart, getTotalItems } = useCart();

  const handleAddToCart = async (productId: number) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      alert('Product added to cart!');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Products</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Our Products</h2>
        <div className="text-sm text-gray-600">
          Cart: {getTotalItems()} items
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={340}
                  height={192}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.category_name}</p>
              <p className="text-xl font-bold text-green-600 mb-3">${product.price}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm px-2 py-1 rounded ${
                  product.is_in_stock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
                
                {product.is_low_stock && (
                  <span className="text-sm px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                    Low Stock
                  </span>
                )}
              </div>

              <button
                onClick={() => handleAddToCart(product.id)}
                disabled={!product.is_in_stock || isInCart(product.id)}
                className={`w-full py-2 px-4 rounded font-medium ${
                  !product.is_in_stock || isInCart(product.id)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Products Found</h3>
          <p className="text-gray-500">Try refreshing the page or check back later.</p>
        </div>
      )}
    </div>
  );
}