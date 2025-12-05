import { useQuery } from '@tanstack/react-query';
import { categoryService, CategoryFilters, Category } from '@/lib/services/category-service';

interface UseCategoriesOptions extends CategoryFilters {
  enabled?: boolean;
}

interface UseCategoriesReturn {
  categories: Category[];
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
 * Hook for fetching categories from external API
 */
export function useCategories(options: UseCategoriesOptions = {}): UseCategoriesReturn {
  const { enabled = true, ...filters } = options;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['categories', filters],
    queryFn: () => categoryService.getCategories(filters),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    categories: data?.results || [],
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
 * Hook for fetching a single category
 */
export function useCategory(slug: string, enabled: boolean = true) {
  const {
    data: category,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoryService.getCategory(slug),
    enabled: enabled && !!slug,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return {
    category,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}

/**
 * Hook for fetching products in a category
 */
export function useCategoryProducts(
  slug: string, 
  filters: {
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  } = {},
  enabled: boolean = true
) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['category-products', slug, filters],
    queryFn: () => categoryService.getCategoryProducts(slug, filters),
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
 * Hook for fetching category statistics
 */
export function useCategoryStats(slug: string, enabled: boolean = true) {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['category-stats', slug],
    queryFn: () => categoryService.getCategoryStats(slug),
    enabled: enabled && !!slug,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    stats,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}
