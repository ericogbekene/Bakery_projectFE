import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductWithCategory, Category, ApiResponse } from '@/lib/types/product';
import { ExternalProduct, ExternalCategory, ExternalApiResponse } from '@/lib/types/external-api';
import { transformExternalProduct, transformExternalCategory, transformExternalProductWithCategory } from '@/lib/utils/data-transformer';
import { getDataSourceConfig, getPrimaryDataSource, getFallbackDataSource } from '@/lib/config/data-sources';
import { externalApiCircuitBreaker } from '@/lib/circuit-breaker';
import externalApiClient from '@/lib/api/external-client';

/**
 * Options for hybrid data fetching
 */
interface UseHybridDataOptions {
  category?: string;
  limit?: number;
  offset?: number;
  search?: string;
  enabled?: boolean;
}

/**
 * Return type for hybrid data hooks
 */
interface UseHybridDataReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  dataSource: 'external' | 'local' | 'hybrid';
  refetch: () => void;
  switchDataSource: (source: 'external' | 'local') => void;
}

/**
 * Fetch products from external API
 */
async function fetchExternalProducts(options: UseHybridDataOptions = {}): Promise<ProductWithCategory[]> {
  const response = await externalApiClient.get<ExternalApiResponse<ExternalProduct[]>>('/products', {
    params: {
      category: options.category,
      limit: options.limit,
      offset: options.offset,
      search: options.search,
    },
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch products from external API');
  }

  // Transform external products to internal format
  return response.data.data.map(product => transformExternalProduct(product) as ProductWithCategory);
}

/**
 * Fetch products from local API
 */
async function fetchLocalProducts(options: UseHybridDataOptions = {}): Promise<ProductWithCategory[]> {
  const params = new URLSearchParams();
  if (options.category) params.append('category', options.category);
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.offset) params.append('offset', options.offset.toString());
  if (options.search) params.append('search', options.search);

  const response = await fetch(`/api/products?${params.toString()}`);
  const data: ApiResponse<ProductWithCategory[]> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch products from local API');
  }

  return data.data;
}

/**
 * Fetch categories from external API
 */
async function fetchExternalCategories(options: UseHybridDataOptions = {}): Promise<Category[]> {
  const response = await externalApiClient.get<ExternalApiResponse<ExternalCategory[]>>('/categories', {
    params: {
      limit: options.limit,
      offset: options.offset,
      search: options.search,
    },
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch categories from external API');
  }

  return response.data.data.map(transformExternalCategory);
}

/**
 * Fetch categories from local API
 */
async function fetchLocalCategories(options: UseHybridDataOptions = {}): Promise<Category[]> {
  const params = new URLSearchParams();
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.offset) params.append('offset', options.offset.toString());
  if (options.search) params.append('search', options.search);

  const response = await fetch(`/api/categories?${params.toString()}`);
  const data: ApiResponse<Category[]> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch categories from local API');
  }

  return data.data;
}

/**
 * Hook for fetching products with hybrid data source support
 */
export function useHybridProducts(options: UseHybridDataOptions = {}): UseHybridDataReturn<ProductWithCategory> {
  const [dataSource, setDataSource] = useState<'external' | 'local' | 'hybrid'>('hybrid');
  const queryClient = useQueryClient();

  const config = getDataSourceConfig();
  const primarySource = getPrimaryDataSource('products');
  const fallbackSource = getFallbackDataSource('products');

  // External API query
  const externalQuery = useQuery({
    queryKey: ['external-products', options],
    queryFn: () => externalApiCircuitBreaker.execute(() => fetchExternalProducts(options)),
    enabled: (dataSource === 'external' || dataSource === 'hybrid') && options.enabled !== false,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Local API query
  const localQuery = useQuery({
    queryKey: ['local-products', options],
    queryFn: () => fetchLocalProducts(options),
    enabled: (dataSource === 'local' || (dataSource === 'hybrid' && externalQuery.isError)) && options.enabled !== false,
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Smart fallback logic
  useEffect(() => {
    if (dataSource === 'hybrid' && externalQuery.isError && !localQuery.isLoading) {
      setDataSource('local');
    }
  }, [dataSource, externalQuery.isError, localQuery.isLoading]);

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['external-products', options] });
    queryClient.invalidateQueries({ queryKey: ['local-products', options] });
  }, [queryClient, options]);

  const switchDataSource = useCallback((source: 'external' | 'local') => {
    setDataSource(source);
  }, []);

  // Determine which data to return
  const data = dataSource === 'external' || (dataSource === 'hybrid' && !externalQuery.isError)
    ? externalQuery.data || []
    : localQuery.data || [];

  const loading = dataSource === 'external' || (dataSource === 'hybrid' && !externalQuery.isError)
    ? externalQuery.isLoading
    : localQuery.isLoading;

  const error = dataSource === 'external' || (dataSource === 'hybrid' && !externalQuery.isError)
    ? externalQuery.error?.message || null
    : localQuery.error?.message || null;

  return {
    data,
    loading,
    error,
    dataSource: dataSource as 'external' | 'local' | 'hybrid',
    refetch,
    switchDataSource,
  };
}

/**
 * Hook for fetching categories with hybrid data source support
 */
export function useHybridCategories(options: UseHybridDataOptions = {}): UseHybridDataReturn<Category> {
  const [dataSource, setDataSource] = useState<'external' | 'local' | 'hybrid'>('hybrid');
  const queryClient = useQueryClient();

  // External API query
  const externalQuery = useQuery({
    queryKey: ['external-categories', options],
    queryFn: () => externalApiCircuitBreaker.execute(() => fetchExternalCategories(options)),
    enabled: (dataSource === 'external' || dataSource === 'hybrid') && options.enabled !== false,
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Local API query
  const localQuery = useQuery({
    queryKey: ['local-categories', options],
    queryFn: () => fetchLocalCategories(options),
    enabled: (dataSource === 'local' || (dataSource === 'hybrid' && externalQuery.isError)) && options.enabled !== false,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  // Smart fallback logic
  useEffect(() => {
    if (dataSource === 'hybrid' && externalQuery.isError && !localQuery.isLoading) {
      setDataSource('local');
    }
  }, [dataSource, externalQuery.isError, localQuery.isLoading]);

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['external-categories', options] });
    queryClient.invalidateQueries({ queryKey: ['local-categories', options] });
  }, [queryClient, options]);

  const switchDataSource = useCallback((source: 'external' | 'local') => {
    setDataSource(source);
  }, []);

  // Determine which data to return
  const data = dataSource === 'external' || (dataSource === 'hybrid' && !externalQuery.isError)
    ? externalQuery.data || []
    : localQuery.data || [];

  const loading = dataSource === 'external' || (dataSource === 'hybrid' && !externalQuery.isError)
    ? externalQuery.isLoading
    : localQuery.isLoading;

  const error = dataSource === 'external' || (dataSource === 'hybrid' && !externalQuery.isError)
    ? externalQuery.error?.message || null
    : localQuery.error?.message || null;

  return {
    data,
    loading,
    error,
    dataSource: dataSource as 'external' | 'local' | 'hybrid',
    refetch,
    switchDataSource,
  };
}
