'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/hooks/useAuth';
import { CartProvider } from '@/lib/hooks/useCart';
import ProductListExample from '@/components/ProductListExample';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export default function ExamplePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
              <div className="max-w-6xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  M&C Cakes - Product Example
                </h1>
                <p className="text-gray-600 mt-2">
                  This page demonstrates the new API integration with the external M&C Cakes API.
                </p>
              </div>
            </div>
            
            <div className="py-8">
              <ProductListExample />
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
