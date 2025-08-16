import { useState, useEffect, useCallback } from 'react'
import { ProductWithCategory, ApiResponse } from '@/lib/types/product'

/**
 * Options for the useProducts hook
 */
interface UseProductsOptions {
  /** Filter products by category slug */
  category?: string
  /** Maximum number of products to fetch */
  limit?: number
  /** Number of products to skip (for pagination) */
  offset?: number
}

/**
 * Return type for the useProducts hook
 */
interface UseProductsReturn {
  /** Array of products with category information */
  products: ProductWithCategory[]
  /** Loading state */
  loading: boolean
  /** Error message if any */
  error: string | null
  /** Function to refetch products */
  refetch: () => void
}

/**
 * Custom React hook for fetching products from the API
 * 
 * Provides loading states, error handling, and automatic refetching.
 * Supports filtering by category and pagination.
 * 
 * @param options - Configuration options for the hook
 * @returns Object containing products, loading state, error, and refetch function
 * 
 * @example
 * ```tsx
 * function ProductList() {
 *   const { products, loading, error } = useProducts({ 
 *     category: 'signature-cakes',
 *     limit: 10 
 *   });
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 * 
 *   return (
 *     <div>
 *       {products.map(product => (
 *         <ProductCard key={product.id} product={product} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.category) params.append('category', options.category)
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.offset) params.append('offset', options.offset.toString())

      const response = await fetch(`/api/products?${params.toString()}`)
      const data: ApiResponse<ProductWithCategory[]> = await response.json()

      if (data.success && data.data) {
        setProducts(data.data)
      } else {
        setError(data.error || 'Failed to fetch products')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }, [options.category, options.limit, options.offset])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  }
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<ProductWithCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products/${id}`)
        const data: ApiResponse<ProductWithCategory> = await response.json()

        if (data.success && data.data) {
          setProduct(data.data)
        } else {
          setError(data.error || 'Failed to fetch product')
        }
      } catch (err) {
        setError('Network error occurred')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return { product, loading, error }
} 