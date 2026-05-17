import {
  Product,
  ProductFilters,
  ProductListResponse,
  productService,
} from "@/lib/services/product-service";
import { useQuery } from "@tanstack/react-query";

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
    total_pages?: number;
    current_page?: number;
    page_size?: number;
  };
}

/**
 * Hook for fetching products from external API
 */
export function useProducts(
  options: UseProductsOptions = {},
): UseProductsReturn {
  const { enabled = true, ...filters } = options;

  const { data, isLoading, error, refetch } = useQuery<ProductListResponse>({
    queryKey: ["products", filters],
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
    pagination: data
      ? {
          count: data.count,
          // Convert null to undefined
          next: data.next === null ? undefined : data.next,
          previous: data.previous === null ? undefined : data.previous,
          total_pages: data.total_pages,
          current_page: data.current_page,
          page_size: data.page_size,
        }
      : undefined,
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
    queryKey: ["product", slug],
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
export function useProductSearch(
  query: string,
  filters: Omit<ProductFilters, "search"> = {},
) {
  const { data, isLoading, error, refetch } = useQuery<ProductListResponse>({
    queryKey: ["product-search", query, filters],
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
    pagination: data
      ? {
          count: data.count,
          next: data.next === null ? undefined : data.next,
          previous: data.previous === null ? undefined : data.previous,
          total_pages: data.total_pages,
          current_page: data.current_page,
          page_size: data.page_size,
        }
      : undefined,
  };
}

/**
 * Hook for fetching featured products
 */
export function useFeaturedProducts() {
  const { data, isLoading, error, refetch } = useQuery<ProductListResponse>({
    queryKey: ["featured-products"],
    // FIXED: Use regular products endpoint with page_size=4

    queryFn: () =>
      productService.getProducts({ page_size: 4, ordering: "-created_at" }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    products: data?.results || [],
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}
