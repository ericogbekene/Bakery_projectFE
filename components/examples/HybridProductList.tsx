import React from 'react';
import { useHybridProducts, useHybridCategories } from '@/lib/hooks/useHybridData';
import { ProductWithCategory, Category } from '@/lib/types/product';
import Image from 'next/image';

/**
 * Example component demonstrating hybrid data fetching
 * Shows how to use external API with fallback to local API
 */
export default function HybridProductList() {
  const {
    data: products,
    loading: productsLoading,
    error: productsError,
    dataSource: productsDataSource,
    refetch: refetchProducts,
    switchDataSource: switchProductsDataSource,
  } = useHybridProducts({
    category: 'signature-cakes',
    limit: 10,
  });

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    dataSource: categoriesDataSource,
    refetch: refetchCategories,
    switchDataSource: switchCategoriesDataSource,
  } = useHybridCategories({
    limit: 20,
  });

  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading products and categories...</span>
      </div>
    );
  }

  if (productsError || categoriesError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-red-800 font-medium">Error loading data</h3>
        <p className="text-red-600 mt-1">
          Products: {productsError || 'OK'} | Categories: {categoriesError || 'OK'}
        </p>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={refetchProducts}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry Products
          </button>
          <button
            onClick={refetchCategories}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Data Source Controls */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Data Source Controls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Products Data Source: {productsDataSource}
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => switchProductsDataSource('external')}
                className={`px-3 py-1 rounded text-sm ${
                  productsDataSource === 'external'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                External
              </button>
              <button
                onClick={() => switchProductsDataSource('local')}
                className={`px-3 py-1 rounded text-sm ${
                  productsDataSource === 'local'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Local
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories Data Source: {categoriesDataSource}
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => switchCategoriesDataSource('external')}
                className={`px-3 py-1 rounded text-sm ${
                  categoriesDataSource === 'external'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                External
              </button>
              <button
                onClick={() => switchCategoriesDataSource('local')}
                className={`px-3 py-1 rounded text-sm ${
                  categoriesDataSource === 'local'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Local
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Categories ({categories.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category: Category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-gray-600 mt-2">{category.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                Source: {categoriesDataSource}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Products ({products.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: ProductWithCategory) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={340}
                  height={192}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.title}</h3>
                <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    {product.price ? `$${product.price.toFixed(2)}` : 'Price on request'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.category.name}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Source: {productsDataSource}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Controls */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={refetchProducts}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Refresh Products
        </button>
        <button
          onClick={refetchCategories}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Refresh Categories
        </button>
      </div>
    </div>
  );
}