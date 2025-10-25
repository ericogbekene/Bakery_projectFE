'use client';

import React, { useState } from 'react';
import { useProducts } from '@/lib/hooks/useProducts';
import { useCategories } from '@/lib/hooks/useCategories';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';
import { httpClient } from '@/lib/api/http-client';
import { Product } from '@/lib/services/product-service';
import { Category } from '@/lib/services/category-service';

interface TestResult {
  healthCheck?: { status?: string; responseTime?: number; timestamp?: string; error?: string };
  products?: { success?: boolean; count?: number; hasResults?: boolean; error?: string };
  categories?: { success?: boolean; count?: number; hasResults?: boolean; error?: string };
  cart?: { success?: boolean; hasItems?: boolean; totalItems?: number; message?: string; error?: string };
}

/**
 * Test component to verify API integration
 * This component tests all the major API endpoints and services
 */
export default function ApiTestComponent() {
  const [testResults, setTestResults] = useState<TestResult>({});
  const [isRunning, setIsRunning] = useState(false);

  // Test hooks
  const { products, loading: productsLoading, error: productsError } = useProducts({ limit: 5 });
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories({ limit: 5 });
  const { cart, loading: cartLoading, error: cartError } = useCart();
  const { isAuthenticated } = useAuth();

  const runApiTests = async () => {
    setIsRunning(true);
    const results: TestResult = {};

    try {
      // Test 1: Health Check
      console.log('Testing API Health Check...');
      const healthCheck = await httpClient.healthCheck();
      results.healthCheck = {
        status: healthCheck.status,
        responseTime: healthCheck.responseTime,
        timestamp: healthCheck.timestamp,
      };
    } catch (error: unknown) {
      results.healthCheck = { error: error instanceof Error ? error.message : String(error) };
    }

    try {
      // Test 2: Products API
      console.log('Testing Products API...');
      const productsResponse = await httpClient.get('/products/products/?limit=3');
      results.products = {
        success: true,
        count: productsResponse.count || 0,
        hasResults: !!productsResponse.results?.length,
      };
    } catch (error: unknown) {
      results.products = { error: error instanceof Error ? error.message : String(error) };
    }

    try {
      // Test 3: Categories API
      console.log('Testing Categories API...');
      const categoriesResponse = await httpClient.get('/products/categories/?limit=3');
      results.categories = {
        success: true,
        count: categoriesResponse.count || 0,
        hasResults: !!categoriesResponse.results?.length,
      };
    } catch (error: unknown) {
      results.categories = { error: error instanceof Error ? error.message : String(error) };
    }

    try {
      // Test 4: Cart API (if authenticated)
      if (isAuthenticated) {
        console.log('Testing Cart API...');
        const cartResponse = await httpClient.get('/cart/cart/');
        results.cart = {
          success: true,
          hasItems: !!cartResponse.cart_items?.length,
          totalItems: cartResponse.total_items || 0,
        };
      } else {
        results.cart = { message: 'Not authenticated - skipping cart test' };
      }
    } catch (error: unknown) {
      results.cart = { error: error instanceof Error ? error.message : String(error) };
    }

    setTestResults(results);
    setIsRunning(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Integration Test</h1>
      
      <div className="mb-6">
        <button
          onClick={runApiTests}
          disabled={isRunning}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isRunning ? 'Running Tests...' : 'Run API Tests'}
        </button>
      </div>

      {/* Hook Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Products Hook</h3>
          <p>Loading: {productsLoading ? 'Yes' : 'No'}</p>
          <p>Error: {productsError || 'None'}</p>
          <p>Count: {products.length}</p>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Categories Hook</h3>
          <p>Loading: {categoriesLoading ? 'Yes' : 'No'}</p>
          <p>Error: {categoriesError || 'None'}</p>
          <p>Count: {categories.length}</p>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Cart Hook</h3>
          <p>Loading: {cartLoading ? 'Yes' : 'No'}</p>
          <p>Error: {cartError || 'None'}</p>
          <p>Items: {cart?.total_items || 0}</p>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Auth Hook</h3>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-4">Test Results</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}

      {/* Sample Data */}
      {products.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Sample Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 3).map((product: Product) => (
              <div key={product.id} className="border p-4 rounded">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-sm text-gray-500">{product.category_name}</p>
                <p className="text-sm">
                  Stock: {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Sample Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.slice(0, 3).map((category: Category) => (
              <div key={category.id} className="border p-4 rounded">
                <h4 className="font-medium">{category.name}</h4>
                <p className="text-sm text-gray-500">{category.description}</p>
                <p className="text-sm">Products: {category.product_count || 0}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}