"use client";

import { httpClient } from "@/lib/api/http-client";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCart } from "@/lib/hooks/useCart";
import { useCategories } from "@/lib/hooks/useCategories";
import { useProducts } from "@/lib/hooks/useProducts";
import { Cart } from "@/lib/services/cart-service";
import {
  Category,
  CategoryListResponse,
} from "@/lib/services/category-service";
import { Product, ProductListResponse } from "@/lib/services/product-service";
import { useState } from "react";

interface TestResult {
  healthCheck?: {
    status?: string;
    responseTime?: number;
    timestamp?: string;
    error?: string;
  };
  products?: {
    success?: boolean;
    count?: number;
    hasResults?: boolean;
    error?: string;
  };
  categories?: {
    success?: boolean;
    count?: number;
    hasResults?: boolean;
    error?: string;
  };
  cart?: {
    success?: boolean;
    hasItems?: boolean;
    totalItems?: number;
    message?: string;
    error?: string;
  };
}

export default function ApiTestComponent() {
  const [testResults, setTestResults] = useState<TestResult>({});
  const [isRunning, setIsRunning] = useState(false);

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts({ page_size: 5 });

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories(); // Fixed: removed page_size parameter

  const { cart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const runApiTests = async () => {
    setIsRunning(true);
    const results: TestResult = {};

    try {
      console.log("Testing API Health Check...");
      const healthCheck = await httpClient.healthCheck();
      results.healthCheck = {
        status: healthCheck.status,
        responseTime: healthCheck.responseTime,
        timestamp: healthCheck.timestamp,
      };
    } catch (error: unknown) {
      results.healthCheck = {
        error: error instanceof Error ? error.message : String(error),
      };
    }

    try {
      console.log("Testing Products API...");
      const productsResponse = await httpClient.get<ProductListResponse>(
        "/products/products/?limit=3",
      );
      results.products = {
        success: true,
        count: productsResponse.count || 0,
        hasResults: !!productsResponse.results?.length,
      };
    } catch (error: unknown) {
      results.products = {
        error: error instanceof Error ? error.message : String(error),
      };
    }

    try {
      console.log("Testing Categories API...");
      const categoriesResponse = await httpClient.get<CategoryListResponse>(
        "/products/categories/?limit=3",
      );
      results.categories = {
        success: true,
        count: categoriesResponse.count || 0,
        hasResults: !!categoriesResponse.results?.length,
      };
    } catch (error: unknown) {
      results.categories = {
        error: error instanceof Error ? error.message : String(error),
      };
    }

    try {
      if (isAuthenticated) {
        console.log("Testing Cart API...");
        const cartResponse = await httpClient.get<Cart>("/cart/cart/");

        // Fixed: Use correct property names from Cart type
        results.cart = {
          success: true,
          hasItems: !!cartResponse.items?.length,
          totalItems: cartResponse.item_count || 0,
        };
      } else {
        results.cart = { message: "Not authenticated - skipping cart test" };
      }
    } catch (error: unknown) {
      results.cart = {
        error: error instanceof Error ? error.message : String(error),
      };
    }

    setTestResults(results);
    setIsRunning(false);
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">API Integration Test</h1>

      <div className="mb-6">
        <button
          onClick={runApiTests}
          disabled={isRunning}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {isRunning ? "Running Tests..." : "Run API Tests"}
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded border p-4">
          <h3 className="mb-2 font-semibold">Products Hook</h3>
          <p>Loading: {productsLoading ? "Yes" : "No"}</p>
          <p>Error: {productsError || "None"}</p>
          <p>Count: {products.length}</p>
        </div>

        <div className="rounded border p-4">
          <h3 className="mb-2 font-semibold">Categories Hook</h3>
          <p>Loading: {categoriesLoading ? "Yes" : "No"}</p>
          <p>Error: {categoriesError || "None"}</p>
          <p>Count: {categories.length}</p>
        </div>

        <div className="rounded border p-4">
          <h3 className="mb-2 font-semibold">Cart Hook</h3>
          <p>Loading: {cartLoading ? "Yes" : "No"}</p>
          {/* Fixed: Use correct property name */}
          <p>Items: {cart?.item_count || 0}</p>
        </div>

        <div className="rounded border p-4">
          <h3 className="mb-2 font-semibold">Auth Hook</h3>
          <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
        </div>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="rounded border p-4">
          <h3 className="mb-4 font-semibold">Test Results</h3>
          <pre className="overflow-auto rounded bg-gray-100 p-4">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}

      {products.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-4 font-semibold">Sample Products</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product: Product) => (
              <div key={product.id} className="rounded border p-4">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-sm text-gray-500">{product.category_name}</p>
                {/* Fixed: Changed is_in_stock to available */}
                <p className="text-sm">
                  Stock: {product.available ? "In Stock" : "Out of Stock"}
                </p>
                <p className="text-xs text-gray-400">
                  Type: {product.product_type_display}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-4 font-semibold">Sample Categories</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 3).map((category: Category) => (
              <div key={category.id} className="rounded border p-4">
                <h4 className="font-medium">{category.name}</h4>
                <p className="text-sm text-gray-500">{category.slug}</p>
                <p className="text-sm">
                  Products: {category.product_count || 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
