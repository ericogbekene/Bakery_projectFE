import { useQuery } from '@tanstack/react-query';
import { productService, ProductFilters, Product } from '@/lib/services/product-service';

interface UseProductsOptions extends ProductFilters {
  enabled?: boolean;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  pagination?: {
    count: number;
    next?: string;
    previous?: string;
  };
}

/**
 * Hook for fetching products from external API
 */
export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const { enabled = true, ...filters } = options;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    products: data?.results || [],
    loading: isLoading,
    error: error?.message || null,
    refetch,
    pagination: data ? {
      count: data.count,
      next: data.next,
      previous: data.previous,
    } : undefined,
  };
}

/**
 * Hook for fetching a single product
 */
export function useProduct(slug: string, enabled: boolean = true) {
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProduct(slug),
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    product,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}

/**
 * Hook for searching products
 */
export function useProductSearch(query: string, filters: Omit<ProductFilters, 'search'> = {}) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['product-search', query, filters],
    queryFn: () => productService.searchProducts(query, filters),
    enabled: !!query,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    products: data?.results || [],
    loading: isLoading,
    error: error?.message || null,
    refetch,
    pagination: data ? {
      count: data.count,
      next: data.next,
      previous: data.previous,
    } : undefined,
  };
}

/**
 * Hook for fetching featured products
 */
export function useFeaturedProducts() {
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getFeaturedProducts(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    products: products || [],
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}
